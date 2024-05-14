# SERVER của ứng dụng tích hợp 2 hệ thống HR & Payroll

`N2D`

# HR & Payroll Dashboard 

A centralized dashboard application for managing HR and Payroll data, built using Node.js, Express.js, and Sequelize.

## Features

* **Employee Management:** View, add, edit, and manage employee profiles from the HR database.
* **Payroll Processing:** Calculate salaries, generate payslips, and track payroll history from the Payroll database.
* **Reporting:** Generate customizable reports on HR and payroll metrics.
* **User Authentication:** Secure login system to control access.
* **Dashboard Interface:** Intuitive and user-friendly interface to visualize data.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/n2duc/integration-hr-payroll
   ```

2. **Install dependencies:**
   ```bash
   cd hr-payroll-dashboard
   npm install 
   ```

## Configuration

1. **Create a `.env` file in the project root:**
  ```
  PORT = 

  # Sql Server
  MSSQL_HOST = 
  MSSQL_PORT = 
  MSSQL_USER = 
  MSSQL_PASSWORD = 
  MSSQL_NAME = 

  # Mysql
  MYSQL_HOST = 
  MYSQL_PORT = 
  MYSQL_USER = 
  MYSQL_PASSWORD = 
  MYSQL_NAME = 
  ```

2. **Update Sequelize models:**
   * Modify models in the `models` directory to reflect your HR and Payroll database schemas.

## Running the Application

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Access the api:** 
   ```bash
   http://localhost:8080/api/employees
   http://localhost:8080/api/employees/1
   http://localhost:8080/api/vacations
   http://localhost:8080/api/incomes
   http://localhost:8080/api/benefit
   http://localhost:8080/api/alert/birthday
   http://localhost:8080/api/alert/excess-vacation
   http://localhost:8080/api/alert/anniversary
   ```

## Contributing

We welcome contributions to improve this project! Please follow these guidelines:

* **Create an issue:** Describe the feature or bug fix you wish to implement.
* **Fork the repository.**
* **Create a branch:**  Name it descriptively (e.g., `employee-search-feature`).
* **Implement your changes.**
* **Submit a pull request.**

## License

This project is licensed under the MIT License – see the [LICENSE.md](LICENSE.md) file for details.

**Important Notes**

* Replace placeholder database names, credentials, and dialects with your actual database information.
* Ensure that `mysql` or other relevant database drivers are installed (`npm install mysql2` or similar).
* Adapt this structure as your project evolves, providing more detailed setup, usage, and development instructions. 

Let me know if you want me to expand on specific parts or add more features! 