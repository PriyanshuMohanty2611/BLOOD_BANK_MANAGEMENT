import sys
import json
import csv
import datetime
import os

def generate_report():
    try:
        # Read data from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print("No data received")
            return

        data = json.loads(input_data)
        
        # Create reports directory if not exists
        if not os.path.exists("reports"):
            os.makedirs("reports")

        filename = f"report_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        filepath = os.path.join("reports", filename)

        with open(filepath, 'w', newline='') as csvfile:
            fieldnames = ['Hospital', 'Blood Group', 'Quantity', 'Date']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for item in data:
                writer.writerow({
                    'Hospital': item.get('hospitalName', 'N/A'),
                    'Blood Group': item.get('bloodGroup', 'N/A'),
                    'Quantity': item.get('quantity', 0),
                    'Date': datetime.datetime.now().strftime("%Y-%m-%d")
                })
        
        # Return absolute path
        print(os.path.abspath(filepath))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    generate_report()
