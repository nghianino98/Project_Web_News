module.exports = function Role () {
    this.roles= {
       admin : {
        role: 'admin',
        selected: false
       },
       editor: {
        role: 'editor',
        selected: false
       },
       subscriber: {
        role: 'subscriber',
        selected: false
       },
       writer: {
        role: 'writer',
        selected: false
       }
    };

    this.enableRole = (role) => {
        this.roles[role].selected = true;
    },

    this.disableRole = (role) => {
        this.roles[role].selected = false;
    },

    this.generateArray = () => {
        var arr = [];

        for (var role in this.roles) {
            arr.push(this.roles[role]);
        }

        return arr;
    }
};