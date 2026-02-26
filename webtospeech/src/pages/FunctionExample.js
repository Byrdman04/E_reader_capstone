function FunctionExample() {
    const functionTest = () => {
        console.log(Add2(5));
    };
    
    return (
        <div className="FunctionExample">
            <h1>This is an example page for calling a separate function</h1>
            <button onClick={functionTest}>Test Add2</button>
        </div>
    );
}

//export default FunctionExample; //This is only here to make FunctionExample not importable

function Add2(num){
    console.log(num + 2);
}