import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail) {
      return res.status(400).json({
        error: "Debe proporcionar username o email para iniciar sesión",
      });
    }

    // Construir la condición de búsqueda
    const searchCondition = {
      [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    };

    // Buscar al usuario por username o email
    const user = await User.findOne({
      where: searchCondition,
    });

    if (user) {
      const passwordValid = await bcrypt.compare(password, user.password);

      if (passwordValid) {
        const token = jwt.sign(
          { id: user.id, email: user.email, username: user.username },
          "holamibro"
        );
        return res.status(200).json({ ok: true, token });
      } else {
        return res
          .status(200)
          .json({ ok: false, error: "Contraseña incorrecta" });
      }
    } else {
      return res
        .status(200)
        .json({ ok: false, error: "Usuario no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el username o el email ya existen
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      return res
        .status(500)
        .json({ message: `Ya existe el ${field}: ${existingUser[field]}` });
    }

    // Verificar la longitud de la contraseña
    if (password.length < 6) {
      return res
        .status(500)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(500)
        .json({ message: "El formato del correo electrónico no es válido" });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ ok: true, newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const authenticateToken = (req, res) => {
  const { token } = req.body;

  try {
    if (token == null) {
      return res.status(200).send("No existe el token");
    }

    jwt.verify(token, "holamibro", (err, user) => {
      console.log(err, user);
      if (err) {
        return res.status(403).send("Invalid token");
      }

      return res.status(200).send({ isValid: true, message: "Token valido" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
