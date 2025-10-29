(function () {

    // Define snippets here
    const snippets = {
        'pre': {
            template: '<pre>$CURSOR</pre>',
            description: 'HTML pre tag'
        },
        'div': {
            template: '<div>$CURSOR</div>',
            description: 'HTML div tag'
        },
        'span': {
            template: '<span>$CURSOR</span>',
            description: 'HTML span tag'
        },
        'for': {
            template: 'for (let i = 0; i < $CURSOR; i++) {\n  \n}',
            description: 'For loop'
        },
        'if': {
            template: 'if ($CURSOR) {\n  \n}',
            description: 'If statement'
        },
        'func': {
            template: 'function $CURSOR() {\n  \n}',
            description: 'Function declaration'
        },
        'log': {
            template: 'console.log($CURSOR);',
            description: 'Console log'
        },
        'arrow': {
            template: '($CURSOR) => {\n  \n}',
            description: 'Arrow function'
        },
        'ngrep': {
            template: 'ng-repeat="$CURSOR"',
            description: 'ng-repeat loop'
        },
        'nginit': {
            template: 'ng-init="$CURSOR"',
            description: 'ng-init'
        },
        'ngclass': {
            template: 'ng-class="$CURSOR"',
            description: 'ng-class'
        },
        'ngclick': {
            template: 'ng-click="$CURSOR"',
            description: 'ng-click'
        },
        'ngif': {
            template: 'ng-if="$CURSOR"',
            description: 'ng-if'
        },
        'odsresults': {
            template: 'ods-results="$CURSOR"  ods-results-context="" ods-results-max="100"',
            description: 'ods-results widget'
        },
        'odsfacet': {
            template: 'ods-facet-results="$CURSOR" ods-facet-results-context="" ods-facet-results-facet-name="" ods-facet-results-sort="alphanum">',
            description: 'ods-facet-results widget'
        },
        'isdefined': {
            template: '| isDefined',
            description: 'isDefined filter'
        },
        'isempty': {
            template: '| isEmpty',
            description: 'isEmpty filter'
        },

    };




    window.snippetsSchema = {
        snippets: snippets
    }
})()