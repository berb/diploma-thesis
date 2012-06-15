var lastest_edition = "1";

var lang = "en";

var languages = {
    "en": "English"
};

var l10n = {
    "en": {
        "draftEdition": "Draft edition",
        "draftNotice": "This is the community edition. Please <a href='http://github.com/berb/diploma-thesis/issues/'>create a ticket or pull request</a> for any corrections, suggestions and enhancements. ",
        "edition": "Edition",
        "editionNotice": "This is the original version of the thesis. There is also an <a href='../community/index.html'>alternative version</a> that can be collaboratively extended.",
        "footer": "Diploma Thesis by <a href='http://www.benjamin-erb.de'>Benjamin Erb</a>, released under a <a href='http://creativecommons.org/licenses/by-sa/3.0/'>Creative Commons</a> license",
        "home": "Home",
        "nextPage": "Next Page",
        "prevPage": "Previous Page",
        "search": "Search",
        "title": "Concurrent Programming for Scalable Web Architectures",
        "subtitle":"Diploma Thesis by Benjamin Erb",
        "subtitleLink":"http://www.benjamin-erb.de/"
    }
};

var scripts = [
    "http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js",
    "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js",    
    "../script/all/jquery.sausage.js"
//    "http://christophercliff.github.com/sausage/jquery.sausage.js"
];

var pkBaseURL = (("https:" == document.location.protocol) ? "https://stats.benjamin-erb.de/piwik/" : "http://stats.benjamin-erb.de/piwik/");
scripts.push(pkBaseURL + "piwik.js");



for(i = 0; i < scripts.length; i++) {
    document.write("<script src='" + scripts[i] + "'></script>");
}

var condcoms = [
    "<!--[if lte IE 8]><link rel='stylesheet' href='../style/all/lte/ie8.css'><![endif]-->",
    "<!--[if lt IE 8]><link rel='stylesheet' href='../style/all/lt/ie8.css'><![endif]-->"
];

for(i = 0; i < condcoms.length; i++) {
    document.write(condcoms[i]);
}

var urls = [
    [".*/editions/([0-9]+)/([a-z]{2})/([a-z]+).html", "build_edition"],
    [".*/draft/([a-z]+).html", "build_draft"],
    [".*/original/([0-9]+_)?([a-z]+).html", "build_edition"],
    [".*/community/([0-9]+_)?([a-z]+).html", "build_draft"],
    [".*/index.html", "build_index"]
];

function check_flag() {
    if ($("body").hasClass("complete")) {
        throw "Document processing is already complete.";
    }
}

function raise_flag() {
    $("body").addClass("complete");
}

function get_header() {
    return '\
      <div class="page_header_spacer inner  ">\
        <div class="search_box">\
          <form class="search" action="http://www.google.com/search">\
            <input type="hidden" name="as_sitesearch" value="http://berb.github.com/diploma-thesis/">\
            <input type="text" name="as_q" value="" class="search_field">\
            <input type="submit" value="'+l10n[lang].search+'" class="search_btn" />\
          </form>\
      </div>\
      </div>\
      <div class="page_header_title ">\
        <h1 class="logo">\
          <a href="#" title="home">'+l10n[lang].title+'</a>\
        </h1>\
      </div>\
      <div class="page_header_sub ">\
        <h1 class="sublogo">\
          <a href="'+l10n[lang].subtitleLink+'" title="home">'+l10n[lang].subtitle+'</a>\
        </h1>\
      </div>\
    ';
}

function get_footer() {
    return '\
      <div class="footer">\
        <div class="container"><p>'
          +l10n[lang].footer+
        '</p></div>\
      </div>\
    ';
}

function template() {
    var contents = $("body").contents();
    if ($(".home").length) {
        $("body").html('\
          <div class="container">\
            ' + get_header() + '\
            <div class="body">\
            </div>\
          </div>\
          ' + get_footer() + '\
        ');
    } else {
        $("body").html('\
          <div class="container">\
            ' + get_header() + '\
            <div class="notice"></div>\
            <div class="inner wrap">\
              <div class="sidebar">\
              </div>\
              <div class="content body">\
              </div>\
              <div class="content_footer">\
              </div>\
            </div>\
          </div>\
          ' + get_footer() + '\
        ');
    }
    $("div.body").html(contents);
    $("div.buy").html(
        '<iframe id="buy" scrolling="no"></iframe>'
    );
    $("#buy").load(function() {
        $("iframe").contents().find("a").attr("target", "_blank");
    });
    $("#buy").attr("src", "buy.html");
}

function link_logo(url) {
    $(".logo a").attr("href", url);
}

function add_notice(text) {
    $(".notice").append(text);
}

function add_notice_draft() {
    add_notice('<p class="inner info_bubble">'+l10n[lang].draftNotice+'</p>');
}

function add_notice_edition(edition) {
    href = document.location.href.replace(
        "/editions/" + edition + "/", "/editions/" + lastest_edition + "/"
    );
    notice = l10n[lang].editionNotice.replace("%s",href);
    if (edition != lastest_edition) {
        add_notice('<p class="inner info_bubble">'+l10n[lang].editionNotice+'</p>');
    }
}

function add_prev_link() {
    prev_url = $("link/[rel='prev']").attr("href");
    if (prev_url) {
        // .sidebar, .content_footer
        $(".sidebar").append(
            "<h3><a href='" + prev_url + "'>"+l10n[lang].prevPage+"</a></h3>"
        );
    } else {
        $(".sidebar").append(
            "<h3 class='disabled'>"+l10n[lang].prevPage+"</h3>"
        );
    }
}

function add_next_link() {
    next_url = $("link/[rel='next']").attr("href");
    if (next_url) {
        // .sidebar, .content_footer
        $(".sidebar").append(
            "<h3><a href='" + next_url + "'>"+l10n[lang].nextPage+"</a></h3>"
        );
    } else {
        $(".sidebar").append(
            "<h3 class='disabled'>"+l10n[lang].nextPage+"</h3>"
        );
    }
}

function add_toc() {
    var old_depth = 0;
    var html = "";
    $("*/[id!='']").each(function(index) {
        var id = $(this).attr("id");
        var name = $(this)[0].nodeName;
        var text = $(this).text();
        if (name.length != 2 || name.slice(0, 1) != "H") {
            return;
        }
        var new_depth = name.slice(1,2);
        if (new_depth > old_depth) {
            html += "<ul>";
        } else if (new_depth < old_depth) {
            html += "</li></ul></li>";
        } else {
            html += "</li>";
        }
        html += "<li><a href='#" + id + "'>" + text + "</a>";
        old_depth = new_depth;
    });
    html += "</li></ul>";
    $(".sidebar").append("<h3>Contents</h3>");
    $(".sidebar").append(html);
}

function build() {
    for(i = 0; i < urls.length; i++) {
        var matches = document.location.href.match(urls[i][0])
        if (matches) {
            window[urls[i][1]](matches);
            break;
        }
    }
}

function build_edition(matches) {
    var edition = matches[1];
    var language = languages[matches[2]];
    var page = matches[3];
    var edition_text = l10n[lang].edition + " " + edition + " (" + language + ")";
    link_logo("../index.html");
    add_notice_edition(edition);
    $(".sidebar").append("<h3><a href='../index.html'>"+l10n[lang].home+"</a></h3>");
    if (page == "index") {
        $(".sidebar").append(
            "<h3>" + edition_text + "</h3>"
        );
    } else {
        $(".sidebar").append(
            "<h3><a href='index.html'>Table of Contents</a></h3>"
        );
    }
    add_prev_link();
    add_next_link();
    add_toc();
}

function build_draft(matches) {
    var page = matches[1];
    link_logo("../index.html");
    add_notice_draft();
    $(".sidebar").append("<h3><a href='../index.html'>"+l10n[lang].home+"</a></h3>");
    if (page == "index") {
        $(".sidebar").append(
            "<h3>"+l10n[lang].draftEdition+"</h3>"
        );
    } else {
        $(".sidebar").append(
            "<h3><a href='index.html'>Table of Contents</a></h3>"
        );
    }
    add_prev_link();
    add_next_link();
    add_toc();
}

function build_index(matches) {
    link_logo("index.html");
}

function autolink() {
    $("*/[id!='']:not(.figure)").wrap(function() {
	        return "<a class='anchor' href='#" + $(this).attr("id") + "' />";
    });
}

function chop() {
    var $content = $(".content");
    var $sections = $("<div/>");
    var $as = $content.find("a.anchor");
    var j = -1;
    $as.each(function(i, el) {
    	$sections.append("<section/>"); 
    });
    $content.children().each(function(i, el) {
        var $el = $(el);
        var $section;
        if ($el.hasClass("anchor")) {
            j++;
        }
        $section = $sections.find("section").eq(j) || $sections;
        $section.append($(el).clone());
    });
    $content.html($sections);
}

function sausage() {
    if ($("section").length < 1) {
        return;
    }
    $(window).sausage({
        page: "section",
        content: function(i, $page) {
            return "<span class='sausage-span'>"
                + $page.find(".anchor").first().text()
                + "</span>";
        }
    });
}

function get_lang() {
    var matches = document.location.href.match(urls[0][0]);
    if (matches && matches.length > 2) {
        lang = matches[2];
    } else {
        lang = "en";
    }
}

function track() {
	try {
		var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 6);
		piwikTracker.trackPageView();
		piwikTracker.enableLinkTracking();
	} catch( err ) {}
	$("body").append('<noscript><p><img src="http://stats.benjamin-erb.de/piwik/piwik.php?idsite=6" style="border:0" alt="" /></p></noscript>');
}

function access(evt){
    prevNext=document.getElementsByTagName("link");
    if(evt.keyCode==37){location=prevNext[1].href}
    if(evt.keyCode==39){location=prevNext[2].href}
}

document.onready = function() {
    document.documentElement.addEventListener("keydown", access, true)
    try {
        check_flag();
        raise_flag();
        get_lang();
        template();
        build();
        autolink();
        chop();
        track();
        sausage();
    } catch (error) {
        // uh oh
    }
}
