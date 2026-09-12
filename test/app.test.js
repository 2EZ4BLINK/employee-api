import dotenv from "dotenv";
import request from "supertest";
import jwt from "jsonwebtoken";

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

  test("should return 400 when email is missing", async () => {
    const signupData = {
      name: "Test User",
      email: "",
      password: "qwertqwertqwert",
    };

    const response = await request(app).post("/auth/signup").send(signupData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });

  test("should return 400 when password is missing", async () => {
    const signupData = {
      name: "Test User",
      email: testEmail,
      password: "",
    };

    const response = await request(app).post("/auth/signup").send(signupData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
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
});

describe("POST /auth/refresh", () => {
  test("should return 401 when refresh token is missing", async () => {
    const response = await request(app).post("/auth/refresh");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No refresh token");
  });

  test("should create new access token with valid refresh token", async () => {
    const agent = request.agent(app);

    await agent.post("/auth/login").send({
      email: "jamesThree@gmail.com",
      password: "qwertqwertqwert",
    });

    const response = await agent.post("/auth/refresh");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("New token created");
    expect(response.body.accessToken).toBeDefined();
  });

  test("should return 401 with invalid refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Cookie", ["refreshToken=fake-token"]);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired refresh token");
  });

  test("should return 401 with expired refresh token", async () => {
    const expiredToken = jwt.sign(
      {
        id: 1,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "-1s",
      },
    );

    const response = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refreshToken=${expiredToken}`]);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired refresh token");
  });

  test("should return 401 when refresh token user no longer exists", async () => {
    // Create temporary user
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password)
     VALUES (?, ?, ?)`,
      ["Deleted User", "deleteduser@test.com", "temporary"],
    );

    const userId = result.insertId;

    // Create valid refresh token for that user
    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Delete the user
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    // Try using their still-valid refresh token
    const response = await request(app)
      .post("/auth/refresh")
      .set("Cookie", `refreshToken=${refreshToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User no longer exists");
  });
});

describe("POST /auth/logout", () => {
  test("should logout successfully and clear refresh token cookie", async () => {
    const agent = request.agent(app);

    await agent.post("/auth/login").send({
      email: "jamesThree@gmail.com",
      password: "qwertqwertqwert",
    });

    const response = await agent.post("/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logout successful");

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("refreshToken=");
    expect(cookies[0]).toContain("Path=/auth");
    expect(cookies[0]).toMatch(/Expires=/);
  });
});

describe("GET /employees", () => {
  test("should return 401 when access token is missing", async () => {
    const response = await request(app).get("/employees");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header is missing");
  });

  test("should return 401 when access token is invalid", async () => {
    const response = await request(app)
      .get("/employees")
      .set("Authorization", "Bearer fake-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  test("should allow request with valid access token", async () => {
    const loginResponse = await request(app).post("/auth/login").send({
      email: "jamesThree@gmail.com",
      password: "qwertqwertqwert",
    });

    const accessToken = loginResponse.body.accessToken;

    const response = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });
});

describe("POST /employees", () => {
  test("should return 403 when user is not admin", async () => {
    const loginResponse = await request(app).post("/auth/login").send({
      email: "jamesTwo@gmail.com",
      password: "qwertqwertqwert",
    });

    const accessToken = loginResponse.body.accessToken;

    const response = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden");
  });
});
