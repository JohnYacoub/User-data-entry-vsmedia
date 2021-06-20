import Home from './views/Home.js'
import AddUser from "./views/AddUser.js";
import ViewUsers from "./views/ViewUsers.js";
import SearchView from "./views/SearchView.js";
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {

    const navBtn = document.querySelectorAll(".nav-btn");
    const BtnList = [...navBtn]
    BtnList.map(btn => {
        btn.classList.remove('active');
        if (btn.href == url) {
            btn.classList.add('active');
        }  
    })
    // document.querys(".quer-btn").classList.toggle('active')
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [{
            path: "/",
            view: Home
        },
        {
            path: "/add",
            view: AddUser
        },
        {
            path: "/edit/:id",
            view: AddUser
        },
        {
            path: "/users",
            view: ViewUsers
        },
        {
            path: "/search",
            view: SearchView
        },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });



    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));


    document.querySelector("#section-content").innerHTML = await view.getHtml();


    //  UI event listener 
    if (match.route.path === "/add") {
        const ui = new AddUser();
        document.querySelector("form").addEventListener("change", (e) => {
            ui.validateUserForm();
        })
        document.querySelector("form").addEventListener("submit", e => {
            e.preventDefault();
            ui.submitForm()
            console.log("submit form clicked!!")
        })
    }

};

window.addEventListener("popstate", router);



document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);

        }
    });

    router();
});