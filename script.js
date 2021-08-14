let createBtn = document.querySelector(".createBtn");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let isClickInInput;
let isclicked = false;
const uid = new ShortUniqueId();
let isDelete = false;
let delBtn = document.querySelector(".deleteBtn");
let unComBtn = document.querySelector(".uncomplete");
let comBtn = document.querySelector(".complete");
let norTar = document.querySelector(".normalTarget");
let impTar = document.querySelector(".impTarget");
let todayDate;
let taskArr = [];
let navRight = document.querySelector(".navRightBottom");
let counter = 0;
let createTitle;
let strDate;
let endDate;
let editBtn = document.querySelector(".editBtn");

norTar.addEventListener("click", function (e) {
  addTargetRate(e.currentTarget, norTar, "blue");
});

impTar.addEventListener("click", function (e) {
  addTargetRate(e.currentTarget, impTar, "red");
});

unComBtn.addEventListener("click", function (e) {
  targetStatus(e.currentTarget, unComBtn, "on");
});

comBtn.addEventListener("click", function (e) {
  targetStatus(e.currentTarget, comBtn, "off");
});

delBtn.addEventListener("click", function (e) {
  editBtnUpdates(e.currentTarget, editBtn);
});

editBtn.addEventListener("click", function (e) {
  editBtnUpdates(e.currentTarget, delBtn);
});

createBtn.addEventListener("click", function (e) {
  if (isclicked) return;
  isclicked = true;
  let createTarget = createTargetPopup(
    `Enter Your Target Title Here<br>
  And Press Enter`,
    "blue"
  );

  isClickInInput = false;
  createTitle.addEventListener("click", function (e) {
    if (isClickInInput) return;
    e.currentTarget.innerText = "";
    isClickInInput = isclicked = true;

    ///////// Set Default Starting And Ending Date

    let strdate = todayDatePlusDay(0);
    strDate.defaultValue = strdate;
    ///set ending date 2 next 2nd day
    let enddate = todayDatePlusDay(3);
    // console.log(date);
    endDate.defaultValue = enddate;

    /////////////////////////////
  });
  chooseTargetRate(createTarget);

  body.append(createTarget);

  /////////////////////////////////Enter Event for save target
  ////////////main functioning start here
  let id = uid();
  addTargetInGrid(id, "unchecked");
});

function daysDifference(date11, date12) {
  //define two date object variables to store the date values
  var date1 = new Date(date11);
  var date2 = new Date(date12);

  // console.log(date11);
  // console.log(date12);

  //calculate time difference
  var time_difference = date2.getTime() - date1.getTime();

  //calculate days difference by dividing total milliseconds in a day
  var result = time_difference / (1000 * 60 * 60 * 24);

  return result;
}

function saveTargetInLocalStorage(color, id, ischeck, title, strDate, endDate) {
  let requiedObj = { color, id, ischeck, title, strDate, endDate };
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  if (!taskArr) taskArr = [];
  taskArr.push(requiedObj);
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function addTargetAfterRefresh() {
  let taskArr = [];
  taskArr = JSON.parse(localStorage.getItem("tasks"));
  // console.log(taskArr);
  for (let i = 0; i < taskArr.length; i++) {
    let clr = taskArr[i].color;
    let id = taskArr[i].id;
    let ischeck = taskArr[i].ischeck;
    let title = taskArr[i].title;
    let strDate = taskArr[i].strDate;
    let endDate = taskArr[i].endDate;

    let target = document.createElement("div");
    target.classList.add("target");
    target.innerHTML = `<div class="color ${clr}"></div>
      <div class="contant">
      <div class="idContainer">
      <div class="id">#${id}</div>
      <input type="checkbox" class="checkBox" ${ischeck} />
      </div>
      <div class="title">${title}</div>
      <div class="time">
      <div class="starting">${strDate}</div>
      <div class="ending">${endDate}</div>
      </div>
      </div>`;

    if (ischeck == "checked") target.querySelector(".checkBox").value = "on";
    else target.querySelector(".checkBox").value = "off";
    target.querySelector(".checkBox").addEventListener("click", function (e) {
      updateCheckBox(e.currentTarget, id, ischeck);
    });

    target.addEventListener("click", function (e) {
      if (delBtn.classList.contains("btnSelect"))
        deleteTarget(e.currentTarget, id);
      if (editBtn.classList.contains("btnSelect"))
        editTarget(e.currentTarget, clr, id, ischeck, title, strDate, endDate);
    });
    grid.appendChild(target);
    todayDate = todayDatePlusDay(0);
    let DayDiffrence = daysDifference(todayDate, endDate);
    // console.log(DayDiffrence,ischeck);
    if (DayDiffrence <= 2 && ischeck == "unchecked") {
      counter++;
      alertTarget(counter, title, endDate, DayDiffrence);
    }
  }
}

addTargetAfterRefresh();

function addTargetInSortedList() {
  navRight.innerHTML = "";
  let taskArr = [];
  taskArr = JSON.parse(localStorage.getItem("tasks"));
  // console.log(taskArr);

  taskArr = taskArr.sort((a, b) => {
    return a.endDate > b.endDate ? 1 : -1;
  });

  // console.log(taskArr);

  for (let i = 0; i < taskArr.length; i++) {
    let clr = taskArr[i].color;
    let id = taskArr[i].id;
    let ischeck = taskArr[i].ischeck;
    let title = taskArr[i].title;
    let endDate = taskArr[i].endDate;

    todayDate = todayDatePlusDay(0);

    let DayDiffrence = daysDifference(todayDate, endDate);

    let sortedTarget = document.createElement("div");
    sortedTarget.classList.add("sortedTarget");
    sortedTarget.innerHTML = `<div class="sortedTarget">
    <div class="sortedColor ${clr}"></div>
    <div class="remainingTime">
      <span>Remaining Time:</span>
      <time>${DayDiffrence} ${DayDiffrence <= 1 ? "Day" : "Days"} .</time>
    </div>
    <div class="sortTargetContainer">
      <div class="argTargetTitle">${title}</div>
    </div>
  </div>`;

    navRight.appendChild(sortedTarget);
  }
}

addTargetInSortedList();

function alertTarget(counter, targetTitle, endDate, remainingDays) {
  alert(
    `Target No. ${counter}\nAlert! Alert! Alert!\nHi, Your Target "${targetTitle}" \nDeadLine Date : ${endDate}\nremaining Days: ${remainingDays} ${
      remainingDays < 2 ? "Day" : "Days"
    }\n\n\nAs the deadline date is drawing near, I wonder if you have remaining Work about your project, Complete it Quickly! \n `
  );
}

function addTargetRate(currentTarget, rate, color) {
  if (currentTarget.classList.contains("select")) {
    currentTarget.classList.remove("select");
    let targets = document.querySelectorAll(".target");
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].classList.contains("displayHidden"))
        targets[i].classList.remove("displayHidden");
    }
  } else {
    if (rate != norTar) norTar.classList.remove("select");
    if (rate != impTar) impTar.classList.remove("select");
    comBtn.classList.remove("btnSelect");
    unComBtn.classList.remove("btnSelect");
    editBtn.classList.remove("btnSelect");
    delBtn.classList.remove("btnSelect");

    currentTarget.classList.add("select");
    let targets = document.querySelectorAll(".target");
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].querySelector(".color").classList[1] != color)
        targets[i].classList.add("displayHidden");
      else targets[i].classList.remove("displayHidden");
    }
  }
}

function targetStatus(currentTarget, btn, status) {
  if (currentTarget.classList.contains("btnSelect")) {
    currentTarget.classList.remove("btnSelect");
    let targets = document.querySelectorAll(".target");
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].classList.contains("displayHidden"))
        targets[i].classList.remove("displayHidden");
    }
  } else {
    if (btn != unComBtn) unComBtn.classList.remove("btnSelect");
    if (btn != comBtn) comBtn.classList.remove("btnSelect");
    impTar.classList.remove("select");
    norTar.classList.remove("select");
    editBtn.classList.remove("btnSelect");
    delBtn.classList.remove("btnSelect");

    currentTarget.classList.add("btnSelect");
    let targets = document.querySelectorAll(".target");
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].querySelector(".checkBox").value == status)
        targets[i].classList.add("displayHidden");
      else targets[i].classList.remove("displayHidden");
    }
  }
}

function deleteTarget(currentTarget, id) {
  currentTarget.remove();
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  if (!taskArr) taskArr = [];

  taskArr = taskArr.filter(function (e) {
    return e.id != id;
  });
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  addTargetInSortedList();
}

function updateCheckBox(currentTarget, id, ischeck) {
  if (currentTarget.getAttribute("checked") == "") {
    currentTarget.removeAttribute("checked");
    currentTarget.setAttribute("unchecked", "");
    currentTarget.value = "off";
    ischeck = "unchecked";

    let taskArr = [];
    taskArr = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i].id == id) {
        taskArr[i].ischeck = ischeck;
      }
    }
    localStorage.setItem("tasks", JSON.stringify(taskArr));
  } else {
    currentTarget.removeAttribute("unchecked");
    currentTarget.setAttribute("checked", "");
    currentTarget.value = "on";
    ischeck = "checked";

    let taskArr = [];
    taskArr = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < taskArr.length; i++) {
      if (taskArr[i].id == id) {
        taskArr[i].ischeck = ischeck;
      }
    }
    localStorage.setItem("tasks", JSON.stringify(taskArr));
  }
}

function todayDatePlusDay(add) {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate() + add;

  if (day <= 9) day = "0" + day;
  else if (
    month == 1 ||
    month == 3 ||
    month == 5 ||
    month == 7 ||
    month == 8 ||
    month == 10 ||
    month == 12
  ) {
    if (day >= 31) day = 31;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    if (day >= 30) day = 30;
  } else {
    if (day >= 28) day = 28;
  }

  if (month <= 9) month = "0" + month;

  return `${year}-${month}-${day}`;
}

function createTargetPopup(content, color) {
  let createTarget = document.createElement("div");
  createTarget.classList.add("createTarget");
  createTarget.innerHTML = `<div class="createTitle" contenteditable>${content}
  </div>
  <div class="createDate">
  <p class = "sDate">Starting Date</p>
  <input type = "date" class = "startDate">
  <p class = "eDate">Ending Date</p>
  <input type = "date" class = "endDate">
  </div>
  <div class="createRate">
  <p class = "createTargetRate">Rate your Target:</p>
  <div class="create blue ${color == "blue" ? "select" : ""}"></div>
  <div class="create red ${color == "red" ? "select" : ""}"></div>
  </div>`;

  /////// remove data from input with First click
  createTitle = createTarget.querySelector(".createTitle");
  strDate = createTarget.querySelector(".startDate");
  endDate = createTarget.querySelector(".endDate");
  return createTarget;
}

function chooseTargetRate(createTarget) {
  let RateList = createTarget.querySelectorAll(".createRate div");
  for (let i = 0; i < RateList.length; i++) {
    RateList[i].addEventListener("click", function (e) {
      ////// remove class from all
      for (let j = 0; j < RateList.length; j++) {
        if (RateList[j].classList.contains("select"))
          RateList[j].classList.remove("select");
      }
      //////////
      e.currentTarget.classList.add("select");
    });
  }
}

function addTargetInGrid(id, ischeck) {
  createTitle.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      let color = document.querySelector(".create.select").classList[1];
      // console.log(targetList.classList[1]);
      let title = e.currentTarget.innerText;

      let target = document.createElement("div");
      target.classList.add("target");
      target.innerHTML = `<div class="color ${color}"></div>
    <div class="contant">
    <div class="idContainer">
    <div class="id">#${id}</div>
    <input type="checkbox" class="checkBox" ${ischeck} />
    </div>
    <div class="title">${title}</div>
    <div class="time">
    <div class="starting">${strDate.value}</div>
    <div class="ending">${endDate.value}</div>
    </div>
    </div>`;

      if (ischeck == "checked") target.querySelector(".checkBox").value = "on";
      else target.querySelector(".checkBox").value = "off";

      target.querySelector(".checkBox").addEventListener("click", function (e) {
        updateCheckBox(e.currentTarget, id, ischeck);
      });

      target.addEventListener("click", function (e) {
        if (
          document.querySelector(".deleteBtn").classList.contains("btnSelect")
        )
          deleteTarget(e.currentTarget, id);
        if (
          document.querySelector(".editBtn").classList.contains("btnSelect")
        ) {
          let str = target.querySelector(".starting").innerText;
          let end = target.querySelector(".ending").innerText;
          editTarget(
            e.currentTarget,
            color,
            id,
            ischeck,
            title,
            str,
            end
          );
        }
      });

      // console.log(daysDifference(strDate.value, endDate.value));

      if (daysDifference(strDate.value, endDate.value) >= 0) {
        saveTargetInLocalStorage(
          color,
          id,
          ischeck,
          title,
          strDate.value,
          endDate.value
        );
        grid.appendChild(target);
        addTargetInSortedList();
      }
      let createTarget = document.querySelector(".createTarget");
      createTarget.remove();
      isclicked = false;
    }
  });
}

function editBtnUpdates(currentTarget, btn) {
  if (currentTarget.classList.contains("btnSelect"))
    currentTarget.classList.remove("btnSelect");
  else {
    currentTarget.classList.add("btnSelect");
    btn.classList.remove("btnSelect");
  }
}

function editTarget(currentTarget, clr, id, ischeck, title, str, end) {
  if (isclicked) return;
  isclicked = true;
  let createTarget = createTargetPopup(title, clr);

  isClickInInput = false;
  createTitle.addEventListener("click", function (e) {
    if (isClickInInput) return;
    e.currentTarget.innerText = title;
    isClickInInput = isclicked = true;

    ///////// Set Default Starting And Ending Date

    // let strdate = todayDatePlusDay(0);

    // console.log(strDate + "\n" + endDate);
    strDate.defaultValue = str;
    ///set ending date 2 next 2nd day
    // let enddate = todayDatePlusDay(3);
    // console.log(date);
    endDate.defaultValue = end;

    /////////////////////////////
  });
  chooseTargetRate(createTarget);

  body.append(createTarget);

  /////////////////////////////////Enter Event for save target
  ////////////main functioning start here
  // let id = uid();
  deleteTarget(currentTarget, id);
  // console.log(ischeck);
  addTargetInGrid(id, ischeck);
}