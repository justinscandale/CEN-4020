# EERIS Database Models

## Visual Diagram

```mermaid
classDiagram
    class User {
        +int userID
        +String firstName
        +String lastName
        +String email
        +String password
        +UserRole role
        +createExpenseReport()
        +viewExpenseReports()
    }

    class Employee {
        +Department department
        +submitExpenseReport()
        +uploadReceipt()
    }

    class Supervisor {
        +reviewExpenseReport()
        +approveExpenseReport()
        +rejectExpenseReport()
        +generateReports()
    }

    class ExpenseReport {
        +int reportID
        +int employeeID
        +Date submissionDate
        +String status
        +double totalAmount
        +String comments
        +calculateTotal()
        +submit()
        +approve()
        +reject()
    }

    class Receipt {
        +int receiptID
        +int reportID
        +Date expenseDate
        +String merchantName
        +String merchantAddress
        +String merchantPhone
        +String merchantWebsite
        +double amount
        +String paymentMethod
        +String imageURL
        +ExpenseCategory category
        +String description
        +uploadImage()
        +extractData()
    }

    class ExpenseCategory {
        +int categoryID
        +String name
        +String description
        +int parentCategoryID
    }

    class Department {
        +int departmentID
        +String name
        +String description
    }

    User <|-- Employee
    User <|-- Supervisor
    Employee "1" -- "*" ExpenseReport
    ExpenseReport "1" -- "*" Receipt
    Receipt "*" -- "1" ExpenseCategory
    Employee "*" -- "1" Department
    ExpenseCategory "0..1" -- "*" ExpenseCategory : parent
```

## Models

### User
- `userID`: int (PK)
- `firstName`: string
- `lastName`: string
- `email`: string
- `password`: string
- `role`: enum (Employee/Supervisor)

### Employee (extends User)
- `departmentID`: int (FK)

### Supervisor (extends User)
No additional fields

### ExpenseReport
- `reportID`: int (PK)
- `employeeID`: int (FK)
- `submissionDate`: datetime
- `status`: string
- `totalAmount`: decimal
- `comments`: string

### Receipt
- `receiptID`: int (PK)
- `reportID`: int (FK)
- `expenseDate`: datetime
- `merchantName`: string
- `merchantAddress`: string
- `merchantPhone`: string
- `merchantWebsite`: string
- `amount`: decimal
- `paymentMethod`: string
- `imageURL`: string
- `categoryID`: int (FK)
- `description`: string

### ExpenseCategory
- `categoryID`: int (PK)
- `name`: string
- `description`: string
- `parentCategoryID`: int (FK, nullable)

### Department
- `departmentID`: int (PK)
- `name`: string
- `description`: string

