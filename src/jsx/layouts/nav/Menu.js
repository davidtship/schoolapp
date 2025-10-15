export const MenuList = [
    {
        title: 'Dashboard',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">dashboard</i>,
        to: 'dashboard',
    },
    {
        title: 'Élèves',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">school</i>,
        content: [
            {
                title: 'Liste',
                to: 'student',
                iconStyle: <i className="material-icons">list_alt</i>,
            },
            {
                title: 'Détails',
                to: '#',
                iconStyle: <i className="material-icons">info</i>,
            },
            {
                title: 'Affectations',
                to: 'affectations',
                iconStyle: <i className="material-icons">assignment_ind</i>,
            },
        ],
    },
    {
        title: 'Organisation',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">apartment</i>,
        content: [
            {
                title: 'Directions',
                to: 'directions',
                iconStyle: <i className="material-icons">business</i>,
            },
            {
                title: 'Sections',
                to: 'sections',
                iconStyle: <i className="material-icons">layers</i>,
            },
            {
                title: 'Options',
                to: 'options',
                iconStyle: <i className="material-icons">tune</i>,
            },
            {
                title: 'Classes',
                to: 'classes',
                iconStyle: <i className="material-icons">class</i>,
            },
        ],
    },
    
    {
        title: 'Payement',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">payment</i>,
        to: 'chart-chartjs',
    },
    {
        title: 'Frais',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">account_balance_wallet</i>,
        content: [
            {
                title: 'Type de frais',
                to: 'type-frais',
                iconStyle: <i className="material-icons">category</i>,
            },
            {
                title: 'Catégorie frais',
                to: 'categorie-frais',
                iconStyle: <i className="material-icons">layers</i>,
            },
            {
                title: 'Frais par option',
                to: 'frais-par-options',
                iconStyle: <i className="material-icons">tune</i>,
            },
        ],
    },
    {
        title: 'Recouvrement',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">monetization_on</i>,
        to: 'chart-chartjs',
    },
    {
        title: 'Rapports',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">bar_chart</i>,
        content: [
            {
                title: 'RechartJs',
                to: 'chart-rechart',
                iconStyle: <i className="material-icons">show_chart</i>,
            },
            {
                title: 'Chartjs',
                to: 'chart-chartjs',
                iconStyle: <i className="material-icons">insert_chart</i>,
            },
            {
                title: 'Sparkline',
                to: 'chart-sparkline',
                iconStyle: <i className="material-icons">timeline</i>,
            },
            {
                title: 'Apexchart',
                to: 'chart-apexchart',
                iconStyle: <i className="material-icons">stacked_line_chart</i>,
            },
        ],
    },
    {
        title: 'Transfert élèves',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">compare_arrows</i>,
        content: [
            {
                title: 'Historique transferts',
                to: '#',
                iconStyle: <i className="material-icons">history</i>,
            },
            {
                title: 'Nouveau transfert',
                to: '#',
                iconStyle: <i className="material-icons">person_add_alt_1</i>,
            },
        ],
    },
    {
        title: 'Paramètres',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">settings</i>,
        content: [
            {
                title: 'Backup',
                to: 'uc-select2',
                iconStyle: <i className="material-icons">backup</i>,
            },
            {
                title: 'Année scolaire',
                to: 'uc-sweetalert',
                iconStyle: <i className="material-icons">calendar_month</i>,
            },
            {
                title: 'Monnaie',
                to: 'monaie',
                iconStyle: <i className="material-icons">currency_exchange</i>,
            },
            {
                title: 'Configuration monnaie',
                to: 'config-monaie',
                iconStyle: <i className="material-icons">attach_money</i>,
            },
            {
                title: 'Configuration scolaire',
                to: 'configSchool',
                iconStyle: <i className="material-icons">school</i>,
            },
        ],
    },
    {
        title: 'Utilisateurs',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">people</i>,
        content: [
            {
                title: 'Liste utilisateurs',
                to: 'form-element',
                iconStyle: <i className="material-icons">person</i>,
            }
        ],
    },
];
