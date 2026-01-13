import sys
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

def create_features(df):
    """Enhanced feature engineering for better accuracy"""
    # Time-based features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['day_of_month'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['week_of_year'] = df['date'].dt.isocalendar().week
    
    # Cyclical encoding for day of week (0-6)
    df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    
    # Cyclical encoding for month (1-12)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    # Days since first record
    min_date = df['date'].min()
    df['days'] = (df['date'] - min_date).dt.days
    
    # Rolling statistics (if enough data)
    if len(df) >= 7:
        df['rolling_mean_7'] = df['value'].rolling(window=7, min_periods=1).mean()
        df['rolling_std_7'] = df['value'].rolling(window=7, min_periods=1).std().fillna(0)
        df['rolling_min_7'] = df['value'].rolling(window=7, min_periods=1).min()
        df['rolling_max_7'] = df['value'].rolling(window=7, min_periods=1).max()
    else:
        df['rolling_mean_7'] = df['value'].mean()
        df['rolling_std_7'] = 0
        df['rolling_min_7'] = df['value'].min()
        df['rolling_max_7'] = df['value'].max()
    
    # Lag features
    df['lag_1'] = df['value'].shift(1).fillna(df['value'].iloc[0])
    df['lag_3'] = df['value'].shift(3).fillna(df['value'].iloc[0])
    df['lag_7'] = df['value'].shift(7).fillna(df['value'].iloc[0])
    
    # Trend features
    df['value_diff'] = df['value'].diff().fillna(0)
    df['value_pct_change'] = df['value'].pct_change().fillna(0).replace([np.inf, -np.inf], 0)
    
    return df

def predict(data):
    """Advanced prediction using ensemble methods"""
    if not data or len(data) < 3:
        return []

    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df['value'] = pd.to_numeric(df['value'])
    
    # Sort by date
    df = df.sort_values('date').reset_index(drop=True)
    
    # Create features
    df = create_features(df)
    
    # Feature columns
    feature_cols = [
        'days', 'day_of_week', 'day_of_month', 'month', 'week_of_year',
        'day_sin', 'day_cos', 'month_sin', 'month_cos',
        'rolling_mean_7', 'rolling_std_7', 'rolling_min_7', 'rolling_max_7',
        'lag_1', 'lag_3', 'lag_7', 'value_diff', 'value_pct_change'
    ]
    
    X = df[feature_cols]
    y = df['value']
    
    # Use ensemble of models for better accuracy
    models = [
        RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, min_samples_split=2),
        GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
    ]
    
    # Train models and get predictions
    predictions_list = []
    
    for model in models:
        model.fit(X, y)
        
        # Predict next 7 days
        last_date = df['date'].max()
        last_value = df['value'].iloc[-1]
        future_predictions = []
        
        # Iterative prediction (use previous predictions as features)
        for i in range(1, 8):
            pred_date = last_date + timedelta(days=i)
            
            # Create feature row for prediction
            future_row = {
                'date': pred_date,
                'value': last_value  # placeholder
            }
            future_df = pd.DataFrame([future_row])
            future_df['date'] = pd.to_datetime(future_df['date'])
            
            # Add to historical data temporarily
            temp_df = pd.concat([df, future_df], ignore_index=True)
            temp_df = create_features(temp_df)
            
            # Get the last row features
            X_pred = temp_df[feature_cols].iloc[-1:].values
            
            # Predict
            pred_value = model.predict(X_pred)[0]
            pred_value = max(0, pred_value)  # Ensure non-negative
            
            future_predictions.append(pred_value)
            
            # Update for next iteration
            df = pd.concat([df, pd.DataFrame([{
                'date': pred_date,
                'value': pred_value,
                'day_of_week': pred_date.dayofweek,
                'day_of_month': pred_date.day,
                'month': pred_date.month,
                'week_of_year': pred_date.isocalendar().week,
                'day_sin': np.sin(2 * np.pi * pred_date.dayofweek / 7),
                'day_cos': np.cos(2 * np.pi * pred_date.dayofweek / 7),
                'month_sin': np.sin(2 * np.pi * pred_date.month / 12),
                'month_cos': np.cos(2 * np.pi * pred_date.month / 12),
                'days': (pred_date - df['date'].min()).days,
                'rolling_mean_7': pred_value,
                'rolling_std_7': 0,
                'rolling_min_7': pred_value,
                'rolling_max_7': pred_value,
                'lag_1': last_value,
                'lag_3': last_value,
                'lag_7': last_value,
                'value_diff': 0,
                'value_pct_change': 0
            }])], ignore_index=True)
            last_value = pred_value
        
        predictions_list.append(future_predictions)
    
    # Ensemble: Average predictions from all models
    ensemble_predictions = np.mean(predictions_list, axis=0)
    
    # Format results
    result = []
    last_date = pd.to_datetime(data[-1]['date'])
    for i, pred in enumerate(ensemble_predictions):
        pred_date = last_date + timedelta(days=i+1)
        result.append({
            'date': pred_date.strftime('%Y-%m-%d'),
            'predicted_value': max(0, int(round(pred)))
        })
    
    return result

def main():
    try:
        # Read JSON from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({'error': 'No input data'}))
            return

        data = json.loads(input_data)
        
        # Determine structure. data might be { 'history': [...] }
        history = data.get('history', [])
        
        predictions = predict(history)
        
        print(json.dumps({'predictions': predictions}))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))

if __name__ == '__main__':
    main()
