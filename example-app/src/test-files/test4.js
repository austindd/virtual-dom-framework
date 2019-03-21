
document.addEventListener('DOMContentLoaded', function () {


    let textNode1 = document.createTextNode('Hello');
    let textNode2 = document.createTextNode('World');

    let header = document.createElement('h1');
    header.appendChild(textNode1);
    header.appendChild(textNode2);

    document.body.appendChild(header);


    let objA = {
        text1: null,
        text2: null,
    }


    function viewNodes() {
        console.log(header.childNodes.length);
        console.log(header.childNodes);
    }

    function normalizeNodes() {
        document.body.normalize();
        console.log(header.childNodes.length);
        console.log(header.childNodes);
    }
    
    function splitNodes() {
        header.childNodes[0].splitText(5);
        console.log(header.childNodes.length);
        console.log(header.childNodes);
    }
    
    function getNodeVariables() {
        let t1 = textNode1;
        let t2 = textNode2;
        console.log(header.childNodes.length);
        console.log(t1);
        console.log(t2);
        console.log(header.childNodes.length);
    }
    
    // Test Interface:
    
    let testBtn1 = document.createElement('button');
    let btnText1 = document.createTextNode('View Nodes');
    testBtn1.appendChild(btnText1);
    testBtn1.onclick = viewNodes;
    document.body.appendChild(testBtn1);


    let testBtn2 = document.createElement('button');
    let btnText2 = document.createTextNode('Normalize Nodes');
    testBtn2.appendChild(btnText2);
    testBtn2.onclick = normalizeNodes;
    document.body.appendChild(testBtn2);
    
    let testBtn3 = document.createElement('button');
    let btnText3 = document.createTextNode('Split Nodes');
    testBtn3.appendChild(btnText3);
    testBtn3.onclick = splitNodes;
    document.body.appendChild(testBtn3);
    
    let testBtn4 = document.createElement('button');
    let btnText4 = document.createTextNode('Get Node Variables');
    testBtn4.appendChild(btnText4);
    testBtn4.onclick = getNodeVariables;
    document.body.appendChild(testBtn4);

    

});

