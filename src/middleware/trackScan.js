const Scan = require('../models/Scan');
const Shop = require('../models/Shop');

const trackScan = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const shop = await Shop.findOne({ slug });

    if (shop) {
      // Extracting basic device info from User-Agent
      const ua = req.headers['user-agent'] || '';
      
      const scanData = {
        shopId: shop._id,
        device: {
          browser: ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Other',
          os: ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : 'Desktop',
          isMobile: /Mobile|Android|iPhone/i.test(ua)
        },
        referrer: req.headers['referer'] || 'Direct Scan'
      };

      // Fire and forget: don't use 'await' here so the response to the user is instant
      new Scan(scanData).save().catch(err => console.error("Analytics Error:", err));
      
      // Attach shop object to request so the controller doesn't have to query DB again
      req.shop = shop;
    }
    
    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    next(); // Move to controller even if analytics fails
  }
};

module.exports = trackScan;