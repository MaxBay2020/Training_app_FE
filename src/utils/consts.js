export const wordsLimit = 100
export const pageLimit = 5

export const ApproveOrReject = {
    APPROVE: 'APPROVED',
    REJECT: 'REJECTED',
    PENDING: 'PENDING',
    WITHDRAWN: 'WITHDRAWN',
}


export const UserRole = {
    APPROVER: 'APPROVER',
    ADMIN: 'ADMIN',
    SERVICER: 'SERVICER'
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

