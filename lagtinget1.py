import requests
import pandas as pd

# API endpoints
themes_url = "https://api.lagtinget.ax/api/themes.json"
seatings_url = "https://api.lagtinget.ax/api/seatings.json"
specific_seating_url = "https://api.lagtinget.ax/api/seatings/54501.json"
presence_states_url = "https://api.lagtinget.ax/api/presence_states.json"

# User-Agent header
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

# Fetch data from themes API
themes_response = requests.get(themes_url, headers=headers)
themes_data = themes_response.json()
themes_df = pd.json_normalize(themes_data)

# Fetch data from seatings API
seatings_response = requests.get(seatings_url, headers=headers)
seatings_data = seatings_response.json()
seatings_df = pd.json_normalize(seatings_data)

# Fetch data from specific seating API
specific_seating_response = requests.get(specific_seating_url, headers=headers)
specific_seating_data = specific_seating_response.json()

# Extract specific columns for the specific seating
columns_to_extract = ["id", "title", "date", "youtube_url", "mp3_url", "activities", "verified"]
specific_seating_values = [specific_seating_data[key] for key in columns_to_extract]
specific_seating_df = pd.DataFrame([specific_seating_values], columns=columns_to_extract)

# Attendees information
attendees = specific_seating_data.get("attendants", [])
attendees_df = pd.json_normalize(attendees)

# Combine specific seating and attendees into a single DataFrame
combined_df = pd.concat([specific_seating_df, attendees_df], axis=1)

# Fetch data from presence states API
presence_states_response = requests.get(presence_states_url, headers=headers)
presence_states_data = presence_states_response.json()
presence_states_df = pd.json_normalize(presence_states_data)

# Create Excel writer
excel_file = "lagtinget_data.xlsx"
with pd.ExcelWriter(excel_file) as writer:
    themes_df.to_excel(writer, sheet_name="Themes", index=False)
    seatings_df.to_excel(writer, sheet_name="Seatings", index=False)

    combined_df.to_excel(writer, sheet_name="Specific Seating & Attendees", index=False)

    presence_states_df.to_excel(writer, sheet_name="Presence States", index=False)

print(f"Data exported to {excel_file}")