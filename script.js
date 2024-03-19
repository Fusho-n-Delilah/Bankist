'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Methods
const displayMovements = function(movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov} €</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
};

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acu, cur) => acu + cur, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function(acc){
  //filter, reduce and display the deposits
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc,mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  //filter, reduce and display the withdrawals
  const out = acc.movements.filter(mov => mov < 0).reduce((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // filter calculate, reduce and display interest payments > 1€
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate)/100).filter(interest => interest >= 1).reduce((acc,int)=> acc +int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function(acc){
  //update UI (display balanc display summary display movements)
  displayMovements(acc.movements);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

const transferFunds = function(amt, tAcc, rAcc){
  if(amt > 0 && tAcc.balance >= amt && rAcc && rAcc?.username !== tAcc.username){
    tAcc.movements.push(-amt);
    rAcc.movements.push(amt);
  }
};

const requestLoan = function(lnAmt, acc){
  if(lnAmt > 0 && acc.movements.some(mov => mov >= 0.1*lnAmt)){
    //checks if there is a deposit of greater or equal to 10% of loan amount then issues a loan if so
    acc.movements.push(lnAmt);
  }
};

const deleteAccount = function(index){
  accounts.splice(index,1);
};

//Event Handlers
btnLogin.addEventListener('click', function(e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value.trim());

  if (currentAccount?.pin === Number(inputLoginPin.value)){
    //display UI and Welcom Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //update UI (display balanc display summary display movements)
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recipient = accounts.find(acc => acc.username === inputTransferTo.value);

  //clean input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  //transfer Funds
  transferFunds(amount, currentAccount, recipient);
  updateUI(currentAccount);
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  //clear form field
  inputLoanAmount.value = '';

  //Loan funds to current account
  requestLoan(amount, currentAccount);

  //update UI
  updateUI(currentAccount);
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  //check if the account being closed is the current accouint
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //Delete Account
    deleteAccount(index);

    //Hide UI
    containerApp.style.opacity = 0;
  };

  //Clear Input Fields
  inputCloseUsername.value = inputClosePin.value = '';
});

//Main Program
createUsernames(accounts);
let currentAccount;

