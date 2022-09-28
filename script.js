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

function start() {
  console.log("start");

  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
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
  } else {
    student.firstname = fullName;
  }

  if (!fullName.includes('"')) {
    student.middlename = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" ")).replaceAll('"', "");
  }
  student.lastname = fullName.substring(fullName.lastIndexOf(" ") + 1);
  if (fullName.includes('"')) {
    student.nickname = fullName.substring(fullName.indexOf('"'), fullName.lastIndexOf('"') + 1);
  }

  student.gender = jsonObject.gender;
  // student.house = capitalization(jsonObject.house.trim());
  student.house = jsonObject.house.toLowerCase();

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
  filterList(filter);
}

function filterList(filterBy) {
  let filteredList = allStudents;
  if (filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  }
  displayList(filteredList);
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

function sortList() {
  const list = allStudents;
  const sortedList = list.sort(sortByName);
  displayList(sortedList);
}

function sortByName(studentA, studentB) {
  if (studentA.firstname < studentB.firstname) {
    return -1;
  } else {
    return 1;
  }
}

function buildList() {
  console.log("buildlist function");
  // const currentList = filterList(allStudents);

  displayList(allStudents);
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
    clone.querySelector(".house").textContent = student.house;
    contentDest.appendChild(clone);
  });
}

// function showDetails(student) {}
