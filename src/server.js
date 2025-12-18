const ReflectMetadata = require('reflect-metadata');
const AppDataSource = require('./config/data-source')
const app = require('./app');
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
        console.log("✅ Base de données connectée")
        console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
