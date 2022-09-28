"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

const studentObj = {
  firstname: "",
  middlename: "",
  nickname: "",
  lastname: "",
  gender: "",
  house: "",
};
const settings = {
  filter: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

function start() {
  console.log("start");

  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON() {
  const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(jsonURL);
  const jsonData = await response.json();

  prepareObjects(jsonData);
  // displayList(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  buildList();
}

function prepareObject(jsonObject) {
  const student = Object.create(studentObj);

  const fullName = capitalization(jsonObject.fullname.trim());

  if (fullName.includes(" ")) {
    student.firstname = fullName.substring(0, fullName.indexOf(" "));
    student.lastname = fullName.substring(fullName.lastIndexOf(" ") + 1);
  } else {
    student.firstname = fullName;
    student.lastname = "unknown";
  }

  if (!fullName.includes('"')) {
    student.middlename = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" ")).replaceAll('"', "");
  } else {
    student.nickname = fullName.substring(fullName.indexOf('"'), fullName.lastIndexOf('"') + 1);
  }

  student.gender = jsonObject.gender;
  // student.house = capitalization(jsonObject.house.trim());
  student.house = jsonObject.house.toLowerCase().trim();

  return student;
}

function capitalization(str) {
  const words = str.split(" ");
  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    })
    .join(" ");
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  }
  return filteredList;
}

function isGryffindor(student) {
  return student.house === "gryffindor";
}
function isHufflepuff(student) {
  return student.house === "hufflepuff";
}
function isRavenclaw(student) {
  return student.house === "ravenclaw";
}
function isSlytherin(student) {
  return student.house === "slytherin";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  console.log("buildlist function");
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(students) {
  const contentDest = document.querySelector(".student_list");
  const template = document.querySelector("template").content;

  contentDest.textContent = "";
  students.forEach((student) => {
    const clone = template.cloneNode(true);
    clone.querySelector(".firstname").textContent = student.firstname;
    // clone.querySelector(".nickname").textContent = student.nickname;
    clone.querySelector(".middlename").textContent = student.middlename;
    clone.querySelector(".lastname").textContent = student.lastname;
    clone.querySelector(".gender").textContent = student.gender;
    clone.querySelector(".house").textContent = capitalization(student.house.trim());
    clone.querySelector("tr").className = student.house;
    contentDest.appendChild(clone);
  });
}

// function showDetails(student) {}
