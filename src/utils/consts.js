export const wordsLimit = 100
export const pageLimit = 5

export const ApproveOrReject = {
    APPROVE: 'APPROVED',
    REJECT: 'REJECTED',
    SUBMITTED: 'SUBMITTED',
    CANCELED: 'CANCELED',
}
export const trainingType = {
    LiveTraining: 'LiveTraining',
    ECLASS: 'ECLASS',
    Webinar: 'Webinar'
}


export const UserRole = {
    APPROVER: 'APPROVER',
    ADMIN: 'ADMIN',
    SERVICER: 'SERVICER',
    SERVICER_COORDINATOR: 'SERVICER COORDINATOR',
}

export const targetTableToDownload = {
    trainingTable: 'trainingTable',
    creditTable: 'creditTable',
    manageUser: 'manageUser',
    manageServicer: 'manageServicer',
}

export const sortingSystem = {
    trainingPage: {
        defaultSortValue: 1,
        trainingPageSortBy: [
            {
                label: 'Latest Created',
                value: 1
            },
            {
                label: 'Training Name',
                value: 2
            },
            {
                label: 'Training Type',
                value: 10
            },
        ]
    },

    creditPage: {
        defaultSortValue: 3,
        creditPageSortBy: [
            {
                label: 'Servicer Master Name',
                value: 3
            },
            {
                label: 'Servicer Master ID',
                value: 11
            }
        ]
    }
}

export const getTrainingTableHeaders = userRole => {
    switch (userRole) {
        case UserRole.SERVICER_COORDINATOR:
            return [
                'Training Name',
                'Training Type',
                'Trainee Email',
                'Trainee Name',
                'Start Date',
                'End Date',
                'Submitted at',
                'Hours',
                'Training Status'
            ]
        case UserRole.SERVICER:
            return [
                'Training Name',
                'Training Type',
                'Start Date',
                'End Date',
                'Submitted at',
                'Hours',
                'Training Status'
            ]
        case UserRole.ADMIN:
        case UserRole.APPROVER:
            return [
                'Servicer ID',
                'Servicer Name',
                'Trainee Email',
                'Trainee Name',
                'Training Name',
                'Training Type',
                'Start Date',
                'End Date',
                'Submitted at',
                'Hours',
                'Training Status'
            ]
    }
}

export const getCreditTableHeaders = [
    'Fiscal Year',
    'Servicer ID',
    'Servicer Name',
    'Appd.LiveTraining',
    'LiveTraining Credits',
    'Appd.EClass',
    'Appd.EClass (Mandatory)',
    'EClass Credits',
    'Appd.Webinar',
    'Webinar Credits',
    'Training Credits'
]

export const getManageUserTableHeaders = [
    'First Name',
    'Last Name',
    'Email',
    'User Role',
    'Servicer ID',
    'Servicer Name',
    'Created At',
    'Updated At',
]


export const getManageServicerTableHeaders = [
    'Servicer ID',
    'Servicer Master',
    'trsiiOptIn',
    'optOutFlag'
]

export const createOrUpdateEnum = {
    create: 'create',
    update: 'update',
    delete: 'delete',
}
