let isUpdate = false
let employeePayrollObj = {}

window.addEventListener("DOMContentLoaded", (event) => {
  //validate name
  const name = document.querySelector("#name");
  name.addEventListener("input", function () {
    if (name.value.length == 0) {
      setTextValue(".name-error","")
      return;
    }
    try {
      new EmployeeData().name = name.value;
      setTextValue(".name-error","")
    } catch (error) {
      setTextValue(".name-error",error)
    }
  });
  
  //validate date
  function checkFulldate(fulldate) {
    try {
      new EmployeeData().startDate = fulldate
      setTextValue(".date-error","")
    } catch (error) {
      setTextValue(".date-error",error)
    } 
  }
  const day = document.querySelector("#day") 
  const month = document.querySelector("#month")
  const year =  document.querySelector("#year")
  day.addEventListener("change" ,function() {
    let fulldate = day.value +" "+month.value+" "+year.value
    checkFulldate(fulldate) 
  })
  month.addEventListener("change" ,function() {
    let fulldate = day.value +" "+month.value+" "+year.value
    checkFulldate(fulldate) 
  })
  year.addEventListener("change" ,function() {
    let fulldate = day.value +" "+month.value+" "+year.value
    checkFulldate(fulldate) 
  })

  //validate salary
  const salary = document.querySelector("#salary");
  setTextValue(".salary-output",salary.value)
  salary.addEventListener("change", function () {
    setTextValue(".salary-output",salary.value)
  });

  checkForUpdate();
  localStorage.removeItem('editEmp')
});


function setTextValue(component,problem){
  let textError = document.querySelector(component);
  textError.textContent = problem
}

function save(event) {
  event.preventDefault()
  event.stopPropagation()
  try {
    setEmployeePayrollObject()
    createAndUpdateStorage()
    resetForm()
    window.location.replace(site_properties.home_page)
  } catch (error) {
    alert(error);
  }
}

function setEmployeePayrollObject() {
  try {
    employeePayrollObj._name = getInputValueById('#name')
  } catch (error) {
    setTextValue('.name-error',error)
    throw error;
  }
  employeePayrollObj._profileImage = getSelectionValue("[name=profile]").pop()
  employeePayrollObj._gender = getSelectionValue("[name=gender]").pop()
  employeePayrollObj._department = getSelectionValue("[name=department]")
  employeePayrollObj._salary = getInputValueById("#salary")
  employeePayrollObj._notes = getInputValueById("#notes")
  let date = getInputValueById("#day")+" "+getInputValueById("#month")+" "+getInputValueById("#year")
  employeePayrollObj._startDate = new Date(date)
}

function createAndUpdateStorage() {
  let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"))
  if (employeePayrollList != undefined) {
    let employeePayrollData = employeePayrollList.find(empData => empData._id == employeePayrollObj._id)
    if(!employeePayrollData){
      employeePayrollList.push(createEmployeePayrollData())
    }else{
      const index = employeePayrollList.map(empData => empData._id).indexOf(employeePayrollData._id)
      employeePayrollList.splice(index,1,createEmployeePayrollData(employeePayrollData._id))
    }
  } else {
    employeePayrollList = [createEmployeePayrollData()]
  }
  alert(employeePayrollList.toString())
  localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList))
}

function createEmployeePayrollData(id) {
  let employee = new EmployeeData()
  if (!id) {
    employee._id = new Date().getTime()
  }
  else{
    employee._id = id
  }
  setEmployeePayrollData(employee)
  return employee
}

function setEmployeePayrollData(employee) {
  try {
    employee.name = getInputValueById('#name')
  } catch (error) {
    setTextValue('.name-error',error)
    throw error;
  }
  employee.profileImage = getSelectionValue("[name=profile]").pop()
  employee.gender = getSelectionValue("[name=gender]").pop()
  employee.department = getSelectionValue("[name=department]")
  employee.salary = getInputValueById("#salary")
  employee.notes = getInputValueById("#notes")
  let date = getInputValueById("#day")+" "+getInputValueById("#month")+" "+getInputValueById("#year")
  employee.startDate = new Date(date)
  alert(employee.toString())
}


const getInputValueById = (id) => {
  let value = document.querySelector(id).value;
  return value;
};

const getSelectionValue = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue)
  let selItems = []
  allItems.forEach(item => {
    if(item.checked) selItems.push(item.value)
  })
  return selItems
}

function resetForm() {
  setValue("#name","")
  unsetSelectedValue("[name=profile]")
  unsetSelectedValue("[name=gender]")
  unsetSelectedValue("[name=department]")
  setValue('#salary',"")
  setValue('#notes',"")
  setValue('#day',"1,")
  setValue('#month',"January")
  setValue('#year',"2021")
}
function  unsetSelectedValue(propertyValue){
  let allItems = document.querySelectorAll(propertyValue)
  allItems.forEach(item =>{
    item.checked = false
  })
}

function setValue(id , value) {
  const element = document.querySelector(id)
  element.value = value
}

//functions required for updates
function checkForUpdate(){
  const employeePayrollJson = localStorage.getItem('editEmp')
  isUpdate = employeePayrollJson ? true : false;
  if(!isUpdate){
    return
  }
  employeePayrollObj = JSON.parse(employeePayrollJson)
  setForm()
}

function setForm() {
  setValue("#name",employeePayrollObj._name)
  setSelectedValue("[name=profile]",employeePayrollObj._profileImage)
  setSelectedValue("[name=gender]",employeePayrollObj._gender)
  setSelectedValue("[name=department]",employeePayrollObj._department)
  setValue('#salary',employeePayrollObj._salary)
  setTextValue(".salary-output",employeePayrollObj._salary)
  setValue('#notes',employeePayrollObj._notes)
  let date = stringDate(employeePayrollObj._startDate).split(" ")
  setValue('#day',date[1])
  setValue('#month',date[0])
  setValue('#year',date[2])
}

function setSelectedValue(propertyValue,value){
  let allItems = document.querySelectorAll
  (propertyValue)
  allItems.forEach(item =>{
    if(Array.isArray(value)){
      if(value.includes(item.value)){
        item.checked = true
      }
    }
    else if (item.value == value){
      item.checked = true
    }
  })
}