function isNumerKey(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    {
        return false;
    }
	
	return true;
}

function loadDays()
{
    var days = document.getElementById('date');
    var opt = document.createElement('option');
    opt.innerHTML = "Ngày";
    opt.value = '-1';
    days.appendChild(opt);

    for (var i = 1; i < 32; ++i)
    {
        opt = document.createElement('option');
        opt.innerHTML = i;
        opt.value = i;
        days.appendChild(opt);
    }
}

function loadMonths()
{
    var months = document.getElementById('month');
    var opt = document.createElement('option');
    opt.innerHTML = "Tháng"
    opt.value = '-1';
    months.appendChild(opt);

    for (var i = 1; i < 13; ++i)
    {
        opt = document.createElement('option');
        opt.innerHTML = i;
        opt.value = i;
        months.appendChild(opt);
    }
}

function loadYears()
{
    var years = document.getElementById('year');
    var opt = document.createElement('option');
    opt.innerHTML = "Năm";
    opt.value='-1';
    years.appendChild(opt);

    for (var i = new Date().getUTCFullYear() + 1; 1949 < i; --i)
    {
        opt = document.createElement('option');
        opt.innerHTML = i;
        opt.value = i;
        years.appendChild(opt);
    }
}