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

  loadJSON();
}

async function loadJSON() {
  const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(jsonURL);
  const jsonData = await response.json();

  prepareObjects(jsonData);
  // showData(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  showData(allStudents);
}

function prepareObject(jsonObject) {
  const student = Object.create(studentObj);

  const fullName = capitalization(jsonObject.fullname.trim());
  student.firstname = fullName.substring(0, fullName.indexOf(" "));
  if (!fullName.includes('"')) {
    student.middlename = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" ")).replaceAll('"', "");
  }
  student.lastname = fullName.substring(fullName.lastIndexOf(" ") + 1);
  if (fullName.includes('"')) {
    student.nickname = fullName.substring(fullName.indexOf('"'), fullName.lastIndexOf('"') + 1);
  }

  student.gender = jsonObject.gender;
  student.house = capitalization(jsonObject.house.trim());
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

function buildList() {
  showData(allStudents);
}

function showData(students) {
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

function showDetails(student) {}
