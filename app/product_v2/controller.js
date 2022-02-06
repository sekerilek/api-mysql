const connection = require("../../config/sequelize");
const fs = require("fs");
const path = require("path");
const Product = require("./model");

const index = async (req, res) => {
  try {
    await Product.findAll().then((result) => {
      if (result.length > 0) {
        res.send({
          status: "success",
          response: result,
        });
      } else {
        res.send({
          status: "failed",
          response: error,
        });
      }
    });
  } catch (error) {
    res.send(error);
  }
};

const view = async (req, res) => {
  try {
    await Product.findAll({
      where: {
        id: req.params.id,
      },
    }).then((result) => {
      if (result.length > 0) {
        res.send({
          status: "success",
          response: result,
        });
      } else {
        res.send({
          status: "failed",
          response: error,
        });
      }
    });
  } catch (error) {
    res.send(error);
  }
};

const store = async (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    try {
      await Product.sync();
      const result = await Product.create({
        users_id,
        name,
        price,
        stock,
        status,
        image_url: `http://localhost:3000/public/${image.originalname}`,
      });
      res.send(result);
    } catch (e) {
      res.send(e);
    }
  }
};

const update = async (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  try {
    if (image) {
      const target = path.join(__dirname, "../../uploads", image.originalname);
      fs.renameSync(image.path, target);
      await Product.update(
        {
          users_id: users_id,
          name: name,
          price: price,
          price: price,
          status: status,
          image_url: `http://localhost:3000/public/${image.originalname}`,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
    } else {
      await Product.update(
        {
          users_id: users_id,
          name: name,
          price: price,
          price: price,
          status: status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

const destroy = async (req, res) => {
  await Product.destroy({
    where: {
      id: req.params.id,
    },
  });
};

module.exports = {
  index,
  view,
  store,
  destroy,
  update,
};
