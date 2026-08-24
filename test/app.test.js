import dotenv from "dotenv";
import request from "supertest";

dotenv.config();

const { default: app } = await import("../app.js");
const { default: pool } = await import("../config/db.js");

afterAll(async () => {
  await pool.end();
});

describe("GET /", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });
});

describe("POST /auth/login", () => {
  test("should login successfully with valid credentials", async () => {
    // Arrange
    const loginData = {
      email: "jamesThree@gmail.com",
      password: "qwertqwertqwert",
    };

    // Act
    const response = await request(app).post("/auth/login").send(loginData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should return 401 with wring password", async () => {
    const loginData = {
      email: "jamesThree@gmail.com",
      password: "wrongpassword",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("should return 401 when user does not exist", async () => {
    const loginData = {
      email: "doesnotexist@gmail.com",
      password: "qwertqwertqwert",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("should return 400 when email is missing", async () => {
    const loginData = {
      email: "",
      password: "qwertqwertqwert",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });

  test("should return 400 when password is missing", async () => {
    const loginData = {
      email: "jamesThree@gmail.com",
      password: "",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });
});

describe("POST /auth/signup", () => {
  const testEmail = "testuser123@gmail.com";
  const existingEmail = "james@gmail.com";

  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email = ?", [testEmail]);
  });

  test("should create user successfully with valid data", async () => {
    const signupData = {
      name: "Test User",
      email: testEmail,
      password: "qwertqwertqwert",
    };

    const response = await request(app).post("/auth/signup").send(signupData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  test("should return 409 when email already exists", async () => {
    const signupData = {
      name: "Test User",
      email: existingEmail,
      password: "qwertqwertqwert",
    };

    const response = await request(app).post("/auth/signup").send(signupData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already exists");
  });

  test("should return 400 when name is missing", async () => {
    const signupData = {
      name: "",
      email: testEmail,
      password: "qwertqwertqwert",
    };

    const response = await request(app).post("/auth/signup").send(signupData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name is required");
  });
});
