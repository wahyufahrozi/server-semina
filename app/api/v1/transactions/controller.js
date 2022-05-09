const Transaction = require("./model");
const moment = require("moment");

const getAllTransaction = async (req, res, next) => {
  /**
   * kita punya data 20
   * kita hanya ingin menampilkan data 10
   * limit = 1
   * skip = 1 *(2-1) hasil = 1
   */
  try {
    const {
      limit = 10, //pagination
      page = 1, //pagination
      event,
      keyword,
      startDate,
      endDate,
    } = req.query;

    let condition = { user: req.user.id };

    if (event) {
      condition = { ...condition, event: event };
    }

    if (startDate && endDate) {
      condition = {
        ...condition,
        "historyEvent.date": {
          $gte: startDate,
          $lte: moment(endDate).add(1, "days"),
        },
      };
    }

    if (keyword) {
      condition = {
        ...condition,
        "historyEvent.title": { $regex: keyword, $options: "i" },
      };
    }

    const result = await Transaction.find(condition)
      .limit(limit)
      .skip(limit * (page - 1));

    const count = await Transaction.countDocuments(condition); // menjumlahkan banyaknya page

    res
      .status(200)
      .json({ data: result, pages: Math.ceil(count / limit), total: count });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

module.exports = { getAllTransaction };
