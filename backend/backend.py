from flask import Flask, jsonify
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the frontend

# Load the game solutions from a text file
try:
    with open("game_solutions_easy.txt", "r") as f:
        game_solutions = [
            list(map(int, line.strip().strip("() ").split(",")))
            for line in f if line.strip()
        ]
    if not isinstance(game_solutions, list) or not all(len(item) == 4 for item in game_solutions):
        raise ValueError("Invalid data format: Expected a list of 4-number sets.")
except (FileNotFoundError, ValueError) as e:
    print(f"Error loading game solutions: {e}")
    game_solutions = []

@app.route("/get_numbers", methods=["GET"])
def get_numbers():
    """Return a random set of 4 numbers from the dataset."""
    if not game_solutions:
        return jsonify({"error": "No game solutions available."}), 500
    numbers = random.choice(game_solutions)  # Already in list format
    return jsonify(numbers)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
