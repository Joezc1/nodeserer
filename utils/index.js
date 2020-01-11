module.exports = {
   getNowDate: function(){
    var date = new Date();
    // var d = date.now()
    var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return d;
}
};

