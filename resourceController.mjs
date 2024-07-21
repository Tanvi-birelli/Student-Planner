import Resource from '../models/Resource.mjs';

// Get all resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user.id });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a new resource
export const addResource = async (req, res) => {
  const { title, link } = req.body;

  try {
    const newResource = new Resource({
      user: req.user.id,
      title,
      link
    });

    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a resource
export const updateResource = async (req, res) => {
  const { title, link } = req.body;

  const updatedResource = { title, link };

  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    if (resource.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: updatedResource },
      { new: true }
    );

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    if (resource.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Resource.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};