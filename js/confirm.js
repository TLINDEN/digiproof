
function confirminit() {
    window.onbeforeunload = function(e) {
	if(window.confirmExit) return confirmExit();
    };
}

var hadConfirmExit = false;
function checkUnsavedChanges() {
    if(App.store && App.store.isDirty && window.hadConfirmExit === false) {
        if(confirm("unsafed changes"))
            saveChanges();
    }
}

function confirmExit() {
    hadConfirmExit = true;
    if(App.store && App.store.isDirty) {
        return "ok";
    }
}
