import Sequelize from 'sequelize'

const db = new Sequelize(
  'postgres://yumana:yumakeren@localhost:5432/hwrakaminmvc'
)

export default db
