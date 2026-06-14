KERALA_DISTRICTS = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
]


DISTRICT_CENTERS = {
    "Thiruvananthapuram": {"lat": 8.5241, "lng": 76.9366, "pincode": "695001"},
    "Kollam": {"lat": 8.8932, "lng": 76.6141, "pincode": "691001"},
    "Pathanamthitta": {"lat": 9.2648, "lng": 76.7870, "pincode": "689645"},
    "Alappuzha": {"lat": 9.4981, "lng": 76.3388, "pincode": "688001"},
    "Kottayam": {"lat": 9.5916, "lng": 76.5222, "pincode": "686001"},
    "Idukki": {"lat": 9.9189, "lng": 77.1025, "pincode": "685602"},
    "Ernakulam": {"lat": 9.9816, "lng": 76.2999, "pincode": "682011"},
    "Thrissur": {"lat": 10.5276, "lng": 76.2144, "pincode": "680001"},
    "Palakkad": {"lat": 10.7867, "lng": 76.6548, "pincode": "678001"},
    "Malappuram": {"lat": 11.0510, "lng": 76.0711, "pincode": "676505"},
    "Kozhikode": {"lat": 11.2588, "lng": 75.7804, "pincode": "673001"},
    "Wayanad": {"lat": 11.6854, "lng": 76.1320, "pincode": "673121"},
    "Kannur": {"lat": 11.8745, "lng": 75.3704, "pincode": "670001"},
    "Kasaragod": {"lat": 12.4996, "lng": 74.9869, "pincode": "671121"},
}


PINCODE_PREFIX_DISTRICTS = {
    "695": "Thiruvananthapuram",
    "691": "Kollam",
    "689": "Pathanamthitta",
    "688": "Alappuzha",
    "686": "Kottayam",
    "685": "Idukki",
    "682": "Ernakulam",
    "683": "Ernakulam",
    "680": "Thrissur",
    "678": "Palakkad",
    "679": "Palakkad",
    "676": "Malappuram",
    "673": "Kozhikode",
    "670": "Kannur",
    "671": "Kasaragod",
}


REASON_TYPES = [
    "Accident",
    "Road Work",
    "Flood",
    "Tree Fall",
    "Political Event",
    "Other",
]


def lookup_pincode(pincode):
    value = str(pincode or "").strip()
    if len(value) != 6 or not value.isdigit():
        return None

    district = PINCODE_PREFIX_DISTRICTS.get(value[:3])
    if not district:
        return None

    center = DISTRICT_CENTERS[district]
    return {
        "pincode": value,
        "district": district,
        "latitude": center["lat"],
        "longitude": center["lng"],
        "label": f"{district}, Kerala",
    }


SEED_REPORTS = [
    {
        "user_id": "User_1024",
        "district": "Ernakulam",
        "from_lat": 9.9816,
        "from_lng": 76.2999,
        "to_lat": 9.9952,
        "to_lng": 76.3208,
        "from_label": "MG Road",
        "to_label": "Vyttila Junction",
        "description": "Slow movement near metro work zone.",
        "reason": "Road Work",
        "road_name": "MG Road to Vyttila",
        "status": "Active",
        "verify_votes": 9,
    },
    {
        "user_id": "User_2048",
        "district": "Kozhikode",
        "from_lat": 11.2588,
        "from_lng": 75.7804,
        "to_lat": 11.2471,
        "to_lng": 75.8330,
        "from_label": "Kozhikode Beach",
        "to_label": "Medical College",
        "description": "Waterlogging has narrowed the route.",
        "reason": "Flood",
        "road_name": "Beach Road",
        "status": "Active",
        "verify_votes": 14,
    },
    {
        "user_id": "User_4096",
        "district": "Thrissur",
        "from_lat": 10.5276,
        "from_lng": 76.2144,
        "to_lat": 10.5167,
        "to_lng": 76.2249,
        "from_label": "Round East",
        "to_label": "Swaraj Round",
        "description": "Event crowd cleared, traffic is normal.",
        "reason": "Political Event",
        "road_name": "Swaraj Round",
        "status": "Resolved",
        "verify_votes": 21,
    },
]
