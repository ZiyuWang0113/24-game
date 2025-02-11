from flask import Flask, jsonify, request
import random
from flask_cors import CORS
import re
from fractions import Fraction
from itertools import permutations, product

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

@app.route("/get_solution", methods=["POST"])
def get_solution():
    data = request.get_json()
    if "numbers" not in data or not isinstance(data["numbers"], list) or len(data["numbers"]) != 4:
        return jsonify({"error": "Invalid input. Expected a list of 4 numbers."}), 400

    nums = data["numbers"]
    solutions = generate_solution(nums)
    one_solution = random.choice(solutions)
    if solutions:
        return jsonify({"solution": one_solution})  # Return one valid solution
    return jsonify({"error": "No solution found"}), 500

@app.route("/get_hint", methods=["POST"])
def get_hint():
    """
    Given four numbers from the request JSON body, return a hint extracted from a valid solution.
    Example Request: { "numbers": [3, 8, 3, 8] }
    """
    data = request.get_json()
    if "numbers" not in data or not isinstance(data["numbers"], list) or len(data["numbers"]) != 4:
        return jsonify({"error": "Invalid input. Expected a list of 4 numbers."}), 400

    nums = data["numbers"]
    solutions = generate_solution(nums)

    if solutions:
        hint = generate_hint(solutions)
        return jsonify({"hint": hint})
    return jsonify({"Error": "No hint available"}), 500


def generate_solution(nums):
    """
    Given four numbers, return all unique valid expressions that evaluate to 24.
    """

    operators = ['+', '-', '*', '/']
    solutions = set()

    for num_perm in permutations(nums):
        for ops in product(operators, repeat=len(nums) - 1):
            solution = evaluate_expression(num_perm, ops)
            if solution:
                solutions.add(solution)

    return sorted(solutions)


def generate_hint(solutions):
    """
    Extract a meaningful intermediate step from a random solution.
    """
    
    chosen_solution = random.choice(solutions)
    match = re.search(r'\((\d+)\s*([+\-*/])\s*(\d+)\)', chosen_solution)

    if match:
        a, op, b = match.groups()
        result = eval(a + op + b)
        fraction_result = Fraction(result).limit_denominator()  # Convert to fraction if needed

        # Display integer if the fraction is a whole number, otherwise display as a fraction
        return f"{a} {op} {b} = {fraction_result if fraction_result.denominator != 1 else fraction_result.numerator}"


# ==========================
# FUNCTION: Evaluate an expression to check if it equals 24
# ==========================
def evaluate_expression(nums, ops):
    """
    Evaluate all possible parenthesizations of the given numbers and operators.
    Returns a string expression that evaluates to 24 if found, otherwise None.
    """
    if len(nums) < 2:
        return None

    if len(nums) == 2:
        a, b = nums
        op = ops[0]
        try:
            if op == '/' and b == 0:
                return None
            expr = f"({a} {op} {b})"
            if abs(eval(expr) - 24) < 1e-6:
                return expr  # No normalize_expression
        except ZeroDivisionError:
            return None

    if len(nums) == 3:
        a, b, c = nums
        op1, op2 = ops
        expressions = [
            f"(({a} {op1} {b}) {op2} {c})",
            f"({a} {op1} ({b} {op2} {c}))"
        ]

        for expr in expressions:
            try:
                if abs(eval(expr) - 24) < 1e-6:
                    return expr  # No normalize_expression
            except ZeroDivisionError:
                continue

    if len(nums) == 4:
        a, b, c, d = nums
        op1, op2, op3 = ops
        expressions = [
            f"(({a} {op1} {b}) {op2} {c}) {op3} {d}",
            f"({a} {op1} ({b} {op2} {c})) {op3} {d}",
            f"({a} {op1} {b}) {op2} ({c} {op3} {d})",
            f"{a} {op1} (({b} {op2} {c}) {op3} {d})",
            f"{a} {op1} ({b} {op2} ({c} {op3} {d}))"
        ]

        for expr in expressions:
            try:
                if abs(eval(expr) - 24) < 1e-6:
                    return expr  # No normalize_expression
            except ZeroDivisionError:
                continue
    return None


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
