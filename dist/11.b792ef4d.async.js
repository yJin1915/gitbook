(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"0Fdr":function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=r(a("p0pE")),n=r(a("d6i3")),u=a("dCQc"),d=a("34ay"),o=a("HZnN"),i={namespace:"register",state:{status:void 0},effects:{submit:n.default.mark(function e(t,a){var r,s,d,o;return n.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,d=a.put,e.next=4,s(u.fakeRegister,r);case 4:return o=e.sent,e.next=7,d({type:"registerHandle",payload:o});case 7:case"end":return e.stop()}},e)})},reducers:{registerHandle:function(e,t){var a=t.payload;return(0,d.setAuthority)("user"),(0,o.reloadAuthorized)(),(0,s.default)({},e,{status:a.status})}}};t.default=i}}]);