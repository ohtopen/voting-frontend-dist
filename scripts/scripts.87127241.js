(function(){"use strict";angular.module("hyyVotingFrontendApp",["ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","restangular"]).config(["$routeProvider",function(a){return a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/sign-up",{templateUrl:"views/sign-up.html",controller:"SignUpCtrl",controllerAs:"session"}).when("/sign-in",{templateUrl:"views/sign-in.html",controller:"SignInCtrl",controllerAs:"session"}).when("/results",{templateUrl:"views/results.html",controller:"ResultCtrl",controllerAs:"result"}).when("/vote",{templateUrl:"views/vote.html",controller:"VoteCtrl",controllerAs:"vote"}).when("/elections",{templateUrl:"views/elections.html",controller:"ElectionsCtrl",controllerAs:"elections"}).otherwise({redirectTo:"/"})}])}).call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]})}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").controller("VoteCtrl",["$scope","$location","candidates","alliances","VoteSrv","errorMonitor",function(a,b,c,d,e,f){this.debug=!1,this.electionId=b.search().election,this.loadError=!1,this.loading=!0,this.selected=null,this.submitting=this.submitted=!1,this.alliances=[],this.candidates=[],this.savedVote=null,Promise.all([d.get(this.electionId),c.get(this.electionId),e.get(this.electionId)]).then(function(a){return function(b){return a.alliances=b[0],a.candidates=b[1],_.isEmpty(b[2])?void 0:(a.savedVote=b[2],a.selected=a.savedVote.candidate_id)}}(this),function(a){return function(b){return a.loadError=!0,f.error(b,"Fetching alliances/candidates failed")}}(this))["finally"](function(b){return function(){return b.loading=!1,a.$apply()}}(this)),this.isProspectSelected=function(){return null!==this.selected},this.select=function(a){return this.selected=a.id},this.isUnsaved=function(){return this.selected&&this.savedVote&&!_.isEmpty(this.savedVote)?this.selected!==this.savedVote.candidate_id:!1},this.submit=function(a){return this.submitting=!0,e.submit(this.electionId,a).then(function(b){return console.log("Vote submitted for id",a,b)},function(b){return function(c){return console.error("Vote failed for id",a,c),b.submitError=!0,f.error(c,"Vote failed")}}(this))["catch"](function(a){return function(b){return a.submitError=!0,f.error(b,"Vote failed for unknown error.")}}(this))["finally"](function(a){return function(){return a.submitted=!0,a.submitting=!1}}(this))}}]).filter("candidate",function(){return function(a,b){return(null!=a?a.name:void 0)===(null!=b?b.name:void 0)&&("undefined"!=typeof a&&null!==a?a.number:void 0)===(null!=b?b.number:void 0)?a:void 0}}).directive("voteProspect",function(){return{restrict:"E",template:"Numero: <strong>{{ prospect.number }}</strong> <br> Nimi: <strong>{{ prospect.name }}</strong>",scope:{selected:"=vtSelected",all:"=vtAll"},link:function(a,b,c){return a.$watch("selected",function(b,c){return a.prospect=_.find(a.all,"id",b)})}}})}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").controller("SignUpCtrl",["SessionSrv","$scope","$location","errorMonitor",function(a,b,c,d){this.loading=!1,this.submitted=!1,this.error=null,this.email=null,this.requestLink=function(b){return this.loading=!0,a.requestLink(b).then(function(a){return function(b){return a.submitted=!0}}(this),function(a){return function(b){return console.error("Failed requesting link",b),a.error=b}}(this))["catch"](function(a){return function(b){return d.error(b,"Requesting session link failed"),a.error=b}}(this))["finally"](function(a){return function(){return a.loading=!1}}(this))}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").service("SessionSrv",["$window","Restangular","elections",function(a,b,c){this.requestLink=function(a){return b.all("sessions").all("link").post({email:a})},this.signIn=function(a){return b.all("sessions").post({token:a}).then(function(a){return function(b){return a.save(b)}}(this))},this.getJwt=function(){return a.sessionStorage.getItem("jwt")},this.getUser=function(){var b;try{return JSON.parse(a.sessionStorage.getItem("user"))}catch(c){return b=c,console.log("Could not get current user",b),{}}},this.save=function(b){return new Promise(function(d,e){return c.save(b.elections),a.sessionStorage.setItem("jwt",b.jwt),a.sessionStorage.setItem("user",JSON.stringify(b.user)),d()})}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").controller("SignInCtrl",["$location","$window","SessionSrv","errorMonitor",function(a,b,c,d){this.loading=!0,this.token=a.search().token,this.invalidToken=null,c.signIn(this.token).then(function(b){return a.search("token",null),a.path("/elections")},function(a){return function(b){return console.error("Sign in failed: ",b),a.invalidToken=!0,403!==b.status?d.error(b,"Sign in failed for other reason than HTTP 403"):void 0}}(this))["finally"](function(a){return function(){return a.loading=!1}}(this))}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").factory("alliances",["SessionRestangular","elections",function(a,b){return{get:function(b){return a.one("elections",b).all("alliances").getList()}}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").factory("candidates",["SessionRestangular","elections",function(a,b){return{get:function(b){return a.one("elections",b).all("candidates").getList()}}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").run(["Restangular",function(a){return a.setBaseUrl("/api")}]).config(["RestangularProvider",function(a){return a.setDefaultHttpFields({timeout:1e4})}]).service("SessionRestangular",["Restangular","SessionSrv",function(a,b){return a.withConfig(function(a){return a.setDefaultHeaders({Authorization:"Bearer "+b.getJwt()})})}]).service("UnauthenticatedRestangular",["Restangular",function(a){return a}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").directive("setClassWhenAtTop",["$window",function(a){var b;return b=angular.element(a),{restrict:"A",link:function(a,c,d){var e,f,g,h;return g=d.setClassWhenAtTop,h=parseInt(d.paddingWhenAtTop,10),f=c.parent(),e=null,b.on("scroll",function(){return e=f.offset().top-h,b.scrollTop()>=e?(c.addClass(g),f.height(c.height())):(c.removeClass(g),f.css("height",null))})}}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").controller("ResultCtrl",function(){})}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").service("VoteSrv",["SessionRestangular",function(a){this.submit=function(b,c){return a.one("elections",b).one("candidates",c).all("vote").post()},this.all=function(){return a.all("votes").getList()},this.get=function(b){return a.one("elections",b).one("vote").get()}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").controller("ElectionsCtrl",["$scope","elections","VoteSrv","errorMonitor",function(a,b,c,d){this.all=null,this.votes=null,this.loading=!0,this.loadError=!1,Promise.all([b.get(),c.all()]).then(function(a){return function(b){return a.all=b[0],a.votes=b[1]}}(this),function(a){return function(b){return a.loadError=b}}(this))["finally"](function(b){return function(){return b.loading=!1,a.$apply()}}(this))}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").factory("elections",["$window",function(a){return{save:function(b){return a.sessionStorage.setItem("elections",JSON.stringify(b))},get:function(){return new Promise(function(b,c){var d;return d=a.sessionStorage.getItem("elections"),d?b(JSON.parse(d)):c("No elections available")})}}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").directive("vtVoteStatus",["$sce",function(a){return{restrict:"EA",scope:{votes:"=vtVoteStatusVotes",election:"=vtVoteStatusElection"},link:function(a,b,c){var d;return d=_.find(a.votes,"election_id",a.election.id),null!=d?b.text("X"):void 0}}}])}.call(this),function(){"use strict";angular.module("hyyVotingFrontendApp").factory("errorMonitor",["SessionSrv",function(a){return{error:function(b,c){return null==c&&(c=""),Rollbar.error(b,{msg:c,user:a.getUser()}),console.error("Reported unexpected error to Rollbar:",b,c,a.getUser())}}}])}.call(this),angular.module("hyyVotingFrontendApp").run(["$templateCache",function(a){"use strict";a.put("views/_contact.html",'<!-- N.B. This embeddable view is agnostic of the Bootstrap grid --> <h4>Lisätietoa</h4> <ul> <li> <a href="https://hyy.helsinki.fi/fi/yhteiskunta-yliopisto/vaikuttaminen-yliopistolla/hallintovaalit">HYYn hallintovaalisivusto</a> </li> <li> Ongelmatilanteessa ota yhteys HYYn vaalityöntekijään <a href="mailto:vaalit@hyy.fi">vaalit@hyy.fi</a> </li> <li> Silva Loikkanen +358 50 551 6147 </li> </ul>'),a.put("views/_info.html",'<div class="col-xs-12 col-sm-6"> <h4>Helsingin yliopiston hallintovaalit</h4> <p> Hallinnon opiskelijaedustajien vaalissa valitaan opiskelijaedustajat kollegioon, tiedekuntaneuvostoon ja laitosneuvostoon. </p> <p> Sisäänkirjautuminen järjestelmään onnistuu <br> <strong>ti 3.11.2015 klo 9:00 - 20:00 ja ke 4.11.2015 klo 9:00 - 17:00</strong> välisenä aikana. Äänestäminen päättyy ke 4.11.2015 klo 17:05 niiden osalta, jotka ehtivät kirjautua sisään ennen ke 4.11.2015 klo 17:00. </p> </div> <div class="col-xs-12 col-sm-6" ng-include src="\'views/_contact.html\'"></div>'),a.put("views/elections.html",'<div class="page-header"> <h1>Hallintovaalit</h1> </div> <div class="row"> <div class="col-xs-12"> <div ng-if="elections.loading"> Ladataan .. </div> </div> </div> <div class="jumbotron alert alert-info" ng-if="elections.loadError"> <div class="container"> <h1>Sisäänkirjaudu</h1> <p> Pääset äänestämään sen jälkeen, kun olet pyytänyt sisäänkirjautumislinkin sähköpostiisi. </p> <a ng-href="#/sign-up" class="btn btn-primary"> Pyydä sisäänkirjautumislinkki </a> </div> </div> <div ng-if="!elections.loadError && !elections.loading" class="row"> <div class="col-xs-12"> <p> Voit äänestää seuraavissa vaaleissa: </p> <table class="table table-striped table-hover"> <thead> <th>Vaalin nimi</th> <th>Äänestetty?</th> </thead> <tbody> <tr ng-repeat="election in elections.all"> <td> <a ng-href="#/vote?election={{ election.id }}">{{ election.name }}</a> </td> <td> <vt-vote-status vt-vote-status-votes="elections.votes" vt-vote-status-election="election"></vt-vote-status> </td> </tr> </tbody> </table> </div> </div>'),a.put("views/main.html",'<div class="jumbotron"> <h1>Tervetuloa äänestämään</h1> <p class="lead"> <img src="images/logo/hyy-seppele.7e86a1e7.png" style="margin: 1.5em; height: 150px" alt="HYYn logo"><br> Tilaa sisäänkirjautumislinkki sähköpostiosoitteeseen, jonka olet ilmoittanut 22.10.2015 mennessä Helsingin yliopiston opiskelijarekisteriin. </p> <p> <a class="btn btn-lg btn-success" ng-href="#/sign-up"> Äänestämään! <span class="glyphicon glyphicon-ok"></span> </a> </p> </div> <div class="row" ng-include="\'views/_info.html\'"></div>'),a.put("views/results.html",'<div class="page-header"> <h1>Vaalitulos</h1> </div> <div class="row"> <div class="col-xs-12 col-sm-8"> <h4>Tulospalvelu</h4> <p> #TODO Missä hallintovaalien tulos julkaistaan? </p> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a feugiat lorem. In interdum elit in odio sollicitudin, quis feugiat massa ullamcorper. Morbi lacinia facilisis augue in maximus. Nullam id aliquam libero. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi neque lacus, scelerisque nec egestas eu, porta eget lectus. Sed luctus dolor non vestibulum tempor. </p> </div> <div class="col-sm-4" ng-include src="\'views/_contact.html\'"></div> </div>'),a.put("views/session.html",""),a.put("views/sign-in.html",'<!-- This page is only presented on an error. User is redirected on success. --> <div class="row"> <div class="col-xs-12"> <div ng-if="session.loading"> Ladataan .. </div> <div ng-if="!session.loading"> <div ng-if="session.invalidToken"> <div class="jumbotron alert alert-danger"> <div class="container"> <h1>Avain ei kelpaa</h1> <p class="lead"> Sisäänkirjautumislinkkisi on vanhentunut tai virheellinen. </p> <p> <a ng-href="#/sign-up" class="btn btn-primary"> Pyydä uusi sisäänkirjautumislinkki </a> </p> </div> </div> </div> </div> </div> <!-- col --> </div> <!-- row -->'),a.put("views/sign-up.html",'<div class="page-header"> <h1>Kirjaudu sisään</h1> </div> <div class="row"> <div class="col-xs-12"> <p> Anna opiskelijarekisteriin tallentamasi sähköpostiosoite, niin sinulle lähetetään sisäänkirjautumislinkki. </p> <p> Salasana lähetetään ainoastaan ennalta tunnettuun sähköpostiosoitteeseen. Tarkista opiskelijarekisteriin antamasi sähköpostiosoitteesi <a href="https://weboodi.helsinki.fi">kirjautumalla WebOodiin</a>. </p> <p> Tarkista myös sähköpostisi roskapostikansio, mikäli et saa sisäänkirjautumislinkkiä. Viime kädessä ota yhteys HYYn vaalityöntekijään <a href="mailto:vaalit@hyy.fi">vaalit@hyy.fi</a> tai +358 50 551 6147. </p> <p> <strong>Huom!</strong> Sisäänkirjautuminen on mahdollista ti 3.11.2015 klo 9:00 - 20:00 ja ke 4.11.2015 klo 9:00 - 17:00 välisenä aikana. </p> <form class="form-horizontal css-form" name="request"> <div class="form-group"> <label for="email" class="col-sm-2 control-label"> Sähköposti </label> <div class="col-sm-10"> <div class="input-group"> <span class="input-group-addon">@</span> <input type="email" class="form-control" placeholder="firstname.lastname@helsinki.fi" required ng-disabled="session.loading || session.submitted" ng-model="session.email"> </div> </div> </div> <div class="form-group"> <div class="col-sm-offset-2 col-sm-10"> <button type="submit" class="btn btn-default btn-primary" ng-disabled="request.$invalid || session.loading" ng-hide="session.submitted || session.error" ng-click="session.requestLink(session.email)"> <div ng-show="session.loading"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Lähetetään .. </div> <span ng-hide="session.loading"> Lähetä sisäänkirjautumislinkki </span> </button> <div ng-show="session.submitted"> <p> Sisäänkirjautumislinkki on lähetetty antamaasi osoitteeseen! </p> <p> Kirjaudu sisään noudattamalla sähköpostiosoiteeseesi lähetettyjä ohjeita. </p> </div> <div class="alert alert-danger" ng-show="session.error"> <p> <strong>Jotain meni pieleen!</strong> Linkkiä ei voitu lähettää. </p> <p> Jos ongelma toistuu, ota yhteys HYYn vaalityöntekijään HYYn vaalityöntekijään vaalit@hyy.fi +358 50 551 6147. </p> <hr> <p> Kerro vaalityöntekijälle virheen tekninen syy: <br> Status: <span ng-bind="session.error.status"></span> <br> Code: <span ng-bind="session.error.data | json"></span> </p> </div> </div> </div> </form> </div> <!-- col --> </div> <!-- row -->'),a.put("views/vote.html",'<div class="page-header"> <h1>Hallintovaalit</h1> </div> <div class="jumbotron alert alert-danger" ng-if="vote.loadError"> <div class="container"> <h1>Kävi hassusti :/</h1> <p> Ehdokastietojen lataaminen epäonnistui. </p> <p> Pyydä <a ng-href="#/sign-up">uusi sisäänkirjautumislinkki</a> ja yritä uudelleen. </p> <a ng-href="#/sign-up" class="btn btn-primary"> Uusi sisäänkirjautumislinkki </a> </div> </div> <div class="row"> <div class="col-xs-12"> <form novalidate ng-hide="vote.loadError"> <div> <!-- required container for set-class-when-at-top --> <div class="panel panel-primary vote-ballot" set-class-when-at-top="fix-to-top" padding-when-at-top="10"> <!-- N.B. padding-when-at-top must match the fixed position px,\n               otherwise a jumpy side-effect will occurr --> <div class="panel-heading"> <h3 class="panel-title">Äänestä</h3> </div> <div class="panel-body"> <span ng-hide="vote.isProspectSelected()"> Valitse ehdokas listasta, sen jälkeen tähän ilmestyy äänestyslippu. </span> <vote-prospect ng-show="vote.isProspectSelected()" vt-selected="vote.selected" vt-all="vote.candidates"> </vote-prospect> <div ng-if="vote.isUnsaved()" class="alert alert-warning"> <p> Olet muuttamassa aiemmin antamaasi ääntä. Muutos kirjataan vasta kun painat "Äänestä". </p> </div> </div> <div class="panel-footer"> <button class="btn btn-primary" ng-click="vote.submit(vote.selected)" ng-disabled="!vote.isProspectSelected() || vote.submitting || vote.submitted" ng-hide="vote.submitted"> <div ng-show="vote.submitting && !vote.submitted"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Äänestetään .. </div> <div ng-hide="vote.submitting || vote.submitted || vote.submitError"> Äänestä </div> </button> <div class="alert alert-success" role="alert" ng-if="vote.submitted && !vote.submitError"> <p> <strong>Äänesi on nyt kirjattu!</strong> </p> <p> Jos sinulla on äänioikeus muihinkin vaaleihin, <br> <a ng-href="#/elections">valitse seuraava vaali</a>. </p> <p> Sulje lopuksi selainikkuna. </p> </div> <div class="alert alert-danger" role="alert" ng-if="vote.submitError"> <strong>Äänestäminen epäonnistui!</strong> <p> Lataa äänestyssivu uudelleen selaimen refresh-toiminnolla ja yritä äänestää uudelleen. </p> <p> Jos ongelma toistuu, ota yhteys HYYn vaalityöntekijään HYYn vaalityöntekijään vaalit@hyy.fi +358 50 551 6147 </p> </div> </div> </div> </div> <div ng-if="vote.loading"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> </div> <div ng-if="!vote.loading"> <!-- SEARCH --> <div class="form-horizontal"> <h2>Hae ehdokasta</h2> <!--\n          <div class="form-group">\n            <label for="candidateNumber" class="col-sm-3 control-label">Numero</label>\n            <div class="col-sm-8">\n              <input class="form-control" ng-model="vote.candidate.number">\n            </div>\n          </div>\n          --> <div class="form-group"> <label for="candidateName" class="col-sm-3 control-label">Ehdokasnimi</label> <div class="col-sm-8"> <input class="form-control" ng-model="vote.candidate.name"> </div> </div> </div> <!-- ALLIANCES --> <div ng-repeat="a in vote.alliances" ng-show="filteredCandidates.length"> <h1 ng-bind="a.name"></h1> <!-- CANDIDATES OF ALLIANCE --> <table class="table table-striped table-hover"> <thead> <th></th> <th>Numero</th> <th>Ehdokas (henkilökohtainen varajäsen)</th> </thead> <tbody> <tr ng-repeat="c in filteredCandidates = (a.candidates | filter:vote.candidate)" ng-class="{ \'info\': vote.selected == c.id }"> <td> <label> <input type="radio" ng-disabled="vote.submitting || vote.submitted" ng-model="vote.selected" ng-value="c.id"> </label></td> <td ng-click="vote.select(c)">{{ c.number }}</td> <td ng-click="vote.select(c)">{{ c.name }}</td>  </tr>  </tbody></table> </div> </div> <!-- /loading --> </form> </div> <!-- col --> </div> <!-- row -->')}]);