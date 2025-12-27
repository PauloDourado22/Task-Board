from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

app = Flask(__name__)
app.secret_key = "your_secret_key_here"  # needed for sessions

# File to store users
USERS_FILE = "users.json"

# Load users from JSON file
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    return {}

# Save users to JSON file
def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

users = load_users()


@app.route("/")
def index():
    if "user" not in session or session["user"] not in users:
        return redirect(url_for("login"))
    user_name = users[session["user"]]["name"]
    return render_template("index.html", user_name=user_name)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if email in users:
            flash("Email already registered.", "error")
            return redirect(url_for("signup"))

        if password != confirm_password:
            flash("Passwords do not match.", "error")
            return redirect(url_for("signup"))

        # Save user with hashed password
        users[email] = {
            "name": name,
            "password": generate_password_hash(password)
        }
        save_users(users)

        # Log the user in
        session["user"] = email
        return redirect(url_for("board"))

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if email in users and check_password_hash(users[email]["password"], password):
            session["user"] = email
            return redirect(url_for("board"))
        else:
            flash("Invalid credentials", "error")
            return redirect(url_for("login"))

    return render_template("login.html")


@app.route("/board")
def board():
    user_email = session.get("user")
    if not user_email or user_email not in users:
        flash("Please log in first.", "error")
        return redirect(url_for("login"))

    user_name = users[user_email]["name"]
    return render_template("board.html", user_name=user_name)


@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=True)
