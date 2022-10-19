'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Vitaliy Havrona',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Anna Mariya Pavliuk',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Vasil Paslavskiy',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Orysya Prots',
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

const loginForm = document.querySelector('.login');
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
// ////////////////////////////////////////////////////////////////////////////////

//Dispay Movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.map(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}
    </div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// create Username for login
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

// Calculating balance and display it
const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = acc.balance + '€';
};

// // accumulator -> SNOWBALL
// const balance = movements.reduce(function(acc, cur, i, arr){
//   return acc + cur
// },0);
// };

// summary 'In' , 'Out' and 'Interst' balance
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = incomes + '€';

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  labelSumOut.textContent = -out + '€';

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Package with most duplicates function
const updateUI = function (acc) {
  calcBalance(acc);
  displayMovements(acc.movements);
  calcDisplaySummary(acc);
};

// login form
let currentUser;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = ` Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear
    inputLoginUsername.value = inputLoginPin.value = '';
    updateUI(currentUser);
    inputLoginPin.blur();
  } else alert('Wrong login or password');
});

// Transfer Function

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const target = inputTransferTo.value;
  const ReceiverAcc = accounts.find(acc => acc.username === target);

  if (
    amount > 0 &&
    ReceiverAcc &&
    target !== currentUser.username &&
    currentUser.balance > amount
  ) {
    currentUser.movements.push(-amount);
    ReceiverAcc.movements.push(amount);
    // Package with main function
    updateUI(currentUser, currentUser.movements);
  } else if (amount < 0 || amount > currentUser.balance) {
    alert(`Wrong value!`);
  } else alert(`You can't transfer money to yourself`);
  // reset values
  inputTransferAmount.value = inputTransferTo.value = '';
});

// loan form
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(Number(inputLoanAmount.value));

    updateUI(currentUser);
  } else alert(`You can't do this!`);
  //reset values
  inputLoanAmount.value = '';
});

// Close acount with data deletes

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    currentUser.pin === Number(inputClosePin.value) &&
    currentUser.username === inputCloseUsername.value
  ) {
    //find index of current account
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    //Delete acc from data
    accounts.splice(index, 1);

    //Return to starting conditions
    labelWelcome.textContent = 'Log in to get started!';
    containerApp.style.opacity = 0;
    loginForm.style.opacity = 1;

    alert('Account was succsesfull deleted');
  }
  inputClosePin.value = inputCloseUsername.value = '';
  console.log(accounts);
});

//Sorting movements
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser.movements, !sorted);
  sorted = !sorted;
});
