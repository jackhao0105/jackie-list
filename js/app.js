/*
	Name App 	: Jack's List Plan App
	Description	: Everyday I will open day and refrersh the day, then I add my work into App
	Date		: August 11th 2019
	Language	: JavaScript
	Developer	: Jack Hao
*/

// Clear the Storge
const clear  =  document.querySelector('.clear');
clear.addEventListener('click', () => {
	localStorage.clear();
	location.reload();
})

// Storgae : Storage tasks
let LIST, id;


// Show the day that you add work
const dateElement 	= document.getElementById('date');
const option		= { weekday:"long", month:"short", day:"numeric" };
const today 		= new Date();
const color 		= document.querySelector('.color')

dateElement.innerHTML = today.toLocaleDateString("en-US", option);

// Edit the color of each day
if(today.getDay() === 0){
	color.className =`display-4 sunday`
} else if( today.getDay() === 1) {
	color.className =`display-4 monday`
} else if( today.getDay() === 2) {
	color.className =`display-4 tuesday`
} else if( today.getDay() === 3) {
	color.className =`display-4 wednesday`
} else if( today.getDay() === 4) {
	color.className =`display-4 thursday`
} else if( today.getDay() === 5) {
	color.className =`display-4 friday`
} else if( today.getDay() === 6) {
	color.className =`display-4 saturday`
}



const CHECK 	= "fa-check-circle";
const UNCHECK 	= 'fa-circle';
const LINE_THROUGH 	= 'strike-through'

// Work Classs : Present Works
class Work{
	constructor(name, time, done, trash){
		this.name = name;
		this.time = time;
		this.done = done;
		this.trash= trash;
	}
}
// UI Class : Handle UI Tasks
class UI{
	// Why in here we use all static method ??
	// We can access without instance
	static displayWork(){
	// CLASSES NAME
	const LIST 	= Store.getLIST();
	let id 	= Store.getID();
		// Iterate through the works
		LIST.forEach( (work) => UI.addWorkToList(work));
	}

	// Add Work to List Work
	static addWorkToList(work){
		const list 	= document.querySelector('#list');

		// if trash true mean this work had compeleted or was deleted !
		if(work.trash){return;}

		const DONE = work.done ? CHECK : UNCHECK;
		const LINE = work.done ? LINE_THROUGH : '';

		// select the position to add work
		const position = 'beforeEnd';

		const item = `
				<li id="item" style=" display: flex;justify-content: space-around;">	
					<i class="far ${DONE}" job="complete" id=${work.id}"></i>
					<p class="text ${LINE}"> ${work.name} <span class="time"> - ${work.time} </span></p>
					<i class="fas fa-trash" job="delete" id=${work.id}></i>
				</li>
		`;

		list.insertAdjacentHTML(position, item);
	}

	// Clear Field
	static clearFields(){
		const name = document.querySelector('#name').value ='';
		const time = document.querySelector('#time').value =''; 	
	}

	static showAlert(message, className){
		// Create a div contain a text alert
		const div = document.createElement('div');
		div.className = `alert alert-${className}`
		div.appendChild(document.createTextNode(message));

		const container = document.querySelector('.container');
		const header 	= document.querySelector('.header')

		// Insert div below Container and above header
		container.insertBefore(div, header)

		// after 3 seconds, the alert will be disappear
	 	setTimeout(() => document.querySelector('.alert').remove(), 3000 )
	}

	// Completed Work
	static compeletedWork(element){
		// when you click on CHECK or UNCHECK, it'll turn on an off.
		element.classList.toggle(CHECK);
		element.classList.toggle(UNCHECK);
		
		// seclet the parentNode of class
		element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
		let _id = parseInt(element.id);
		LIST[_id].done = LIST[_id].done ? false : true; 
		console.log(LIST[_id].done)
	}


	// Remove Work
	static removeWork(element){
		element.parentNode.parentNode.removeChild(element.parentNode);
		let _id = parseInt(element.id);
		console.log(_id)
		LIST[_id].trash = true;
	}


}

class Store{
	static getLIST(){
		let data = localStorage.getItem('TODO');

		if(data){
			LIST 	= JSON.parse(data);
		} else {
			LIST 	= [];
		}

		return LIST;
	}

	static getID(){
		let data = localStorage.getItem('TODO');

		if(data){
			id 		= LIST.length;

		} else {
			id 		= 0;	
		}

		return id;
	}


	static addWork(work){
		const LIST 	= Store.getLIST();
		let id 	= Store.getID();
		LIST.push(work);
		localStorage.setItem('TODO', JSON.stringify(LIST)); 
	}

	static deleteWork(element){
		const LIST 	= Store.getLIST();
		let id 	= Store.getID();
		console.log(id)

		let _id = parseInt(element.id)
		console.log(_id)

		LIST.forEach((work, index)=> {
			if( work.id ===  _id ){
				LIST.splice(index, 1)
			}
		});

		localStorage.setItem('TODO', JSON.stringify(LIST))
	}
}


// Event: Display work 
document.addEventListener('DOMContentLoaded', UI.displayWork);

// Event: Add Work
document.querySelector('#work-form').addEventListener('submit', (e) =>{
	// Prevent acutal submit
	e.preventDefault();

	// Get value 
	const name = document.querySelector('#name').value;
	const time = document.querySelector('#time').value; 	


	// Alert if input is empmty
	if( name === '' || time === ''){
		UI.showAlert('Please fill in the fiedls 😠😠😠', 'danger')
	} else {
		//Instantiate
	const work = new Work(name, time, false, false);
	work.id = id;
	console.log(work.id);
	id++;

	// work.id = id;
	// id++;
	console.log(work);

	// Add wok to UI
	UI.addWorkToList(work);

	// Add work to store
	Store.addWork(work);

	// Alert when you input success
	UI.showAlert('Try to complete Work 😆😆😆', 'success')

	// Clear Fields
	UI.clearFields();

	}
	
})

// Target the items create dymanically
document.querySelector('#list').addEventListener('click', (e) =>{
	let element 	= e.target;
	let elementJOB	= element.attributes.job.value;	

	if( elementJOB === "complete"){
		UI.compeletedWork(element);

		// Show alert when you're done your work
		UI.showAlert("You're done 🔥🔥🔥 ", 'warning')
	}else if ( elementJOB === "delete" ){
		UI.removeWork(element);

		// Show alert
		UI.showAlert('fukout the here 😠😠😠', 'danger');

		// Remove the work out store
		Store.deleteWork(element);
	}

	localStorage.setItem('TODO', JSON.stringify(LIST));
});


