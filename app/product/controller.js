const connection = require("../../config/mysql");
const fs = require("fs");
const path = require("path");

const index = (req, res) => {
  const { search } = req.query;
  let execute = {};
  if (search) {
    execute = {
      sql: "SELECT * FROM product WHERE name like ?",
      values: [`%${search}%`],
    };
  } else {
    execute = {
      sql: "SELECT * FROM product",
    };
  }
  connection.query(execute, _response(res));
};

const view = (req, res) => {
  connection.query(
    {
      sql: "SELECT * FROM product WHERE id = ?",
      values: [req.params.id],
    },
    _response(res)
  );
};

const store = (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    connection.query(
      {
        sql: "INSERT INTO product (users_id, name, price, stock, status, image_url) VALUES (?,?,?,?,?,?)",
        values: [
          parseInt(users_id),
          name,
          price,
          stock,
          status,
          `http://localhost:3000/public/${image.originalname}`,
        ],
      },
      _response(res)
    );
  }
};

const update = (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  let sql = "";
  let values = [];
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    sql =
      "UPDATE product set users_id = ?, name = ?, price = ?, stock = ?, status = ?, image_url = ? WHERE id = ?";
    values = [
      parseInt(users_id),
      name,
      price,
      stock,
      status,
      `http://localhost:3000/public/${image.originalname}`,
      req.params.id,
    ];
  } else {
    sql =
      "UPDATE product set users_id = ?, name = ?, price = ?, stock = ?, status = ? WHERE id = ?";
    values = [parseInt(users_id), name, price, stock, status, req.params.id];
  }
  connection.query({ sql, values }, _response(res));
};

const destroy = (req, res) => {
  connection.query(
    {
      sql: "DELETE FROM product WHERE id = ?",
      values: [req.params.id],
    },
    _response(res)
  );
};

const _response = (res) => {
  return (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        response: error,
      });
    } else {
      res.send({
        status: "success",
        response: result,
      });
    }
  };
};

module.exports = {
  index,
  view,
  store,
  update,
  destroy,
};
