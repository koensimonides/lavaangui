function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

function addTerms(node, edge) {
    let node_label = node.data('label');
    let premultiplier = false;
    let formula;
    if (edge.hasClass("fixed")) {
        formula = edge.data('value') + "*" + node_label;
        premultiplier = true;
    } else if (edge.hasClass("forcefree")) {
        formula = "NA*" + node_label;
        premultiplier = true;
    }

    if (edge.hasClass("label")) {
        label = edge.data('label');
        if (!premultiplier) {
            formula = label + "*" + node_label;
        } else {
            formula += " + " + label + "*" + node_label;
        }
    } else {
        if (!premultiplier) {
            formula = node_label;
        } else {
            formula += " + " + node_label;
        }
    }
    return formula
}

function createSyntax() {
    var syntax = "";
    if (loadedFileName === "") {
        loadedFileName === "YOUR_DATA.csv"
    }

    var R_script = "library(lavaan)" + "\n";
    R_script = "data <- read.csv('data.csv')" + "\n";

    // measurement model
    var latentNodes = cy.nodes(function (node) { return node.hasClass('latent-variable') });

    for (var i = 0; i < latentNodes.length; i++) {
        var latentNode = latentNodes[i];
        var nodeNames = "";
        var connectedEdges = latentNode.connectedEdges(function (edge) {
            return edge.hasClass('directed') && edge.source().id() == latentNode.id()
        });
        if (connectedEdges.length > 0) {
            syntax += "# measurement model" + '\n '

            for (var j = 0; j < connectedEdges.length; j++) {
                var node = connectedEdges[j].target();
                if (j > 0) {
                    nodeNames += " + ";
                }

                nodeNames += addTerms(node, connectedEdges[j]);
            }
            syntax += latentNode.data('label') + ' =~ ' + nodeNames + '\n ';
        }
    }

    // regression
    reg_edges = cy.edges(function (edge) {
        res = edge.hasClass("directed") &&
            !edge.source().hasClass("constant") &&
            !(edge.source().hasClass("latent-variable") && edge.target().hasClass("observed-variable"));
        return res;
    })
    reg_nodes = [];
    for (var i = 0; i < reg_edges.length; i++) {
        if (!containsObject(reg_nodes, reg_edges[i].target())) {
            reg_nodes.push(reg_edges[i].target())
        }
    };

    for (var i = 0; i < reg_nodes.length; i++) {
        var targetNode = reg_nodes[i];
        var connectedEdges = targetNode.connectedEdges(function (edge) {
            return edge.hasClass('directed') && edge.target().id() == targetNode.id()
        });
        if (connectedEdges.length > 0) {
            var nodeNames = "";
            syntax += '\n' + "# regressions" + '\n'
            for (var j = 0; j < connectedEdges.length; j++) {
                var node = connectedEdges[j].source();
                if (j > 0) {
                    nodeNames += " + ";
                }
                nodeNames += addTerms(node, connectedEdges[j]);
            }
            syntax += targetNode.data('label') + ' ~ ' + nodeNames + '\n ';
        }
    }

    // covariances
    cov_edges = cy.edges(function (edge) { return edge.hasClass("undirected") || edge.hasClass("loop") })
    if (cov_edges.length > 0) {
        var nodeNames = "";
        syntax += '\n' + "# residual (co)variances" + '\n'
        for (var i = 0; i < cov_edges.length; i++) {
            node1 = cov_edges[i].source().data('label');
            node2 = cov_edges[i].target().data('label');
            syntax += node1 + ' ~~ ' + addTerms(cov_edges[i].target(), cov_edges[i]) + '\n ';
        }
    }

    // mean structure
    constant_nodes = cy.nodes(function (node) { return node.hasClass('constant') });
    for (let i = 0; i < constant_nodes.length; i++) {
        c_node = constant_nodes[i];
        var connectedEdges = c_node.connectedEdges();
        if (connectedEdges.length > 0) {
            syntax += "# intercepts" + '\n '
            for (var j = 0; j < connectedEdges.length; j++) {
                var node = connectedEdges[j].target();
                syntax += node.data('label') + ' ~ 1 \n ';
            }
        }
    }


    R_script += "model = '" + syntax + "'" + "\n "

    //fixed part
    R_script += "result <- sem(model, data)" + "\n "
    // summary(result, fit.measures=TRUE);
    console.log(R_script)
    return R_script
};

$("#ctrScript").click(function () {
    run(false);
});

$("#run").click(function () {
    run(true);
});

function run(run) {
    R_script = createSyntax()
    Shiny.setInputValue("R_script", R_script);
    Shiny.setInputValue("run", run);
}

function findEdge(lhs, op, rhs) {
    let directed;
    let source;
    let target;

    if (op === "=~") {
        directed = "directed";
        source = lhs;
        target = rhs;
    } else {
        target = lhs;
        source = rhs;
        if (op === "~~") {
            if (lhs === rhs) {
                directed = "loop";
            } else {
                directed = "undirected";
            }
        } else if (op === "~") {
            directed = "directed";
        }
    }

    correct_edge = cy.edges(function (edge) {
        res = edge.source().data('label') == source && edge.target().data('label') == target
        if (directed == "undirected") {
            res = res || (edge.source().data('label') == target && edge.target().data('label') == source)
        }
        return res;
    })
    return correct_edge
}

//save all results in data attributes of the correct edges
Shiny.addCustomMessageHandler('lav_results', function (lav_result) {
    for (let i = 0; i < lav_result.lhs.length; i++) {
        edge = findEdge(lav_result.lhs[i], lav_result.op[i], lav_result.rhs[i]);
        edge.data('value', lav_result.est[i].toFixed(2))
        edge.data('p-value', lav_result.pvalue[i].toFixed(2))
        edge.data('se', lav_result.se[i].toFixed(2))
        edge.addClass('hasEst')
    }
});