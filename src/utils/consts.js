export const wordsLimit = 100
export const urlLimit = 500
export const pageLimit = 100

export const ApproveOrReject = {
    APPROVE: 'APPROVED',
    REJECT: 'REJECTED',
    SUBMITTED: 'SUBMITTED',
    CANCELED: 'CANCELED',
}


export const UserRole = {
    APPROVER: 'APPROVER',
    ADMIN: 'ADMIN',
    SERVICER: 'SERVICER',
    SERVICER_COORDINATOR: 'SERVICER COORDINATOR',
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
            }
        ]
    },

    creditPage: {
        defaultSortValue: 3,
        creditPageSortBy: [
            {
                label: 'Servicer Master Name',
                value: 3
            }
        ]
    }
}

