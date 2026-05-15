//declarando variables las cuales van a guardar el nombre y la edad del usuario

let IsTrue = true;

while (IsTrue) {
  let Name = prompt("enter your name");
  let Age = prompt("Enter your age");

  if (!Number(Age)) {
    alert("Error: Por favor, ingresa una edad válida en números.");
    IsTrue = true;
  }
  else if(Age <=0 ){
    alert("digite una edad valida")
    IsTrue = true
  }
  else if (Age <=18){
    alert(`Hola ${Name}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`)
    IsTrue = false;
  }
  else if (Age >=18){
    alert(`Hola ${Name}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`)
    IsTrue = false;
  }
  else {
    IsTrue = false
  }
  
}

