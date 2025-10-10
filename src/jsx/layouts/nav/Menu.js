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
                title: 'Nouveau',
                to: 'add-student',
                iconStyle: <i className="material-icons">person_add</i>,
            },
            {
                title: 'Liste',
                to: 'student',
                iconStyle: <i className="material-icons">list</i>,
            },
            {
                title: 'Détails',
                to: 'student-details',
                iconStyle: <i className="material-icons">info</i>,
            },
            {
                title: 'Affectations',
                to: 'student-assign',
                iconStyle: <i className="material-icons">assignment_ind</i>,
            },
        ],
    },
    {
        title: 'Classes',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">class</i>,
        content: [
            {
                title: 'Liste des classes',
                to: 'classes',
                iconStyle: <i className="material-icons">view_list</i>,
            },
            {
                title: 'Détails classe',
                to: 'class-details',
                iconStyle: <i className="material-icons">info_outline</i>,
            },
        ],
    },
    {
        title: 'Paiements',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">payments</i>,
        content: [
            {
                title: 'Fichiers',
                to: 'file-manager',
                iconStyle: <i className="material-icons">folder_open</i>,
            },
            {
                title: 'Utilisateurs',
                to: 'user',
                iconStyle: <i className="material-icons">group</i>,
            },
            {
                title: 'Calendrier',
                to: 'calendar',
                iconStyle: <i className="material-icons">calendar_today</i>,
            },
            {
                title: 'Chat',
                to: 'chat',
                iconStyle: <i className="material-icons">chat</i>,
            },
            {
                title: 'Activité',
                to: 'activity',
                iconStyle: <i className="material-icons">timeline</i>,
            },
        ],
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
                iconStyle: <i className="material-icons">area_chart</i>,
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
                to: 'transfert-eleve',
                iconStyle: <i className="material-icons">history</i>,
            },
            {
                title: 'Nouveau transfert',
                to: 'ajout-transfert',
                iconStyle: <i className="material-icons">person_add_alt</i>,
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
                iconStyle: <i className="material-icons">currency_exchange</i>,
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
            },
            {
                title: 'Wizard',
                to: 'form-wizard',
                iconStyle: <i className="material-icons">auto_fix_high</i>,
            },
            {
                title: 'CkEditor',
                to: 'form-ckeditor',
                iconStyle: <i className="material-icons">edit_note</i>,
            },
            {
                title: 'Pickers',
                to: 'form-pickers',
                iconStyle: <i className="material-icons">date_range</i>,
            },
            {
                title: 'Validation',
                to: 'form-validation',
                iconStyle: <i className="material-icons">check_circle</i>,
            },
        ],
    },
];
