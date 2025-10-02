class BaseController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res, next) => {
    try {
      const data = await this.model.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await this.model.findAll();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.model.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const [updated] = await this.model.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      const data = await this.model.findByPk(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deleted = await this.model.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      res.status(200).json({ success: true, message: 'Resource deleted' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = BaseController;
