import db from "../config.db.js";

const getListEmployee = async (req, res) => {
  try {
    const employees = await db.sqlServer.query(
      `SELECT * FROM Personal `,
      {
        type: db.sqlServer.QueryTypes.SELECT,
      }
    );
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getAll = async (req, res) => {
  try {
    const personal = await db.PersonalTest.findAll();
    return res.json(personal);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

const createPersonal = async (req, res) => {
  try {
    const personal = await db.PersonalTest.create(req.body);
    return res.json(personal);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
}

export default { getListEmployee, getAll, createPersonal }