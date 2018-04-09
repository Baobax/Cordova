const NOM = "QUnit", PRENOM = "Test", NUMTEL = "0989876765";

QUnit.test("Ajout d'un contact", function(assert) {
    var done = assert.async();

    var nbContacts = _nbContacts;
    addContact(NOM, PRENOM, NUMTEL);

    setTimeout(function() {
        assert.deepEqual(_nbContacts, nbContacts + 1, "Nombre de contacts : avant ajout = " + nbContacts + ", après = " + _nbContacts);
        done();
    }, 500);

    setTimeout(function() {
        deleteTestContact();
    }, 600);
});



function onSuccessRemove(contact) {
    getContacts();
}

function onErrorRemove() {
    alert("Error on remove");
}

function onSuccessFind(contact) {
    contact[0].remove(onSuccessRemove, onErrorRemove);
}

function onErrorFind(contactError) {
    alert("Error = " + contactError.code);
}

function deleteTestContact() {
    var options = new ContactFindOptions();
    options.filter = NOM;
    options.multiple = false;
    options.hasPhoneNumber = true;
    var fields = ["displayName", "name"];
    navigator.contacts.find(fields, onSuccessFind, onErrorFind, options);
}