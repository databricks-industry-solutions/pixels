filterSelection("all")

function filterSelection(c) {
  var x, i;
  console.log(c)
  x = document.getElementsByClassName("column");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}


// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

var modal = document.getElementById('myModal'); // Get modal

var img = document.getElementById('myImg'); // Get img for modal
var modalImg = document.getElementById("img01"); // Place image in modal
var captionText = document.getElementById("caption"); // Use alt for caption

function showImg(url){
    modal.style.display = "block";
    modalImg.src = url;      
    //captionText.innerHTML = ele.alt;
}
var close = document.getElementsByClassName("close")[0];

function init() {
    // Init click handlers for all images, assumes Image is first element in content div
    images = document.getElementsByClassName("content");
    for (i=0; i < images.length; i++) {
        images[i].firstElementChild.addEventListener("click", function(e){
            // put small block image into Modal area.
            console.log(e)
            if (e.toElement) {
              src = e.toElement.currentSrc
              console.log(src)
              modal.style.display = "block";
              modalImg.src = src;
            }
         })
    }
    url = ''
}

init()
