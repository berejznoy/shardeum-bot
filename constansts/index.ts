export const NodeStatuses = {
    active: 'active',
    stopped: 'stopped',
    standby: 'standby'
}

export const dictionaries = {
    waiting: {
        ru: 'Подождите одну минуту и попробуйте еще раз',
        en: 'Wait one minute and try again'
    },
    commands: {
        ru: 'Доступные команды \n'+
            '/status - Получить статус \n'+
            '/performance - Получить информацию о загрузке системы \n'+
            '/notify - Включить уведомления и автозапуск ноды',
        en: 'Available commands \n'+
            '/status - Get node status \n'+
            '/performance - Get server load information \n'+
            '/notify - Enable node status notifications and restart the node if it is stopped'
    },
    statuses: {
        offline: {
            ru: 'Статус: offline. Проверьте ноду вручную',
            en: 'Status: offline. Check your node'
        },
        active: {
            ru: `Нода активна`,
            en: 'Node is active'
        },
        stopped: {
            ru: 'Нода остановилась. Пробую перезапустить...',
            en: 'Node stopped. Try to restart...'
        },
        standby: {
            stopped: {
                ru: 'Нода в режиме ожидания',
                en: 'Node is standby'
            }
        }
    },
    notify: {
        new: {
            ru: 'Уведомления и рестарт ноды включены',
            en: 'Notifications and node restart enabled',
        },
        exist: {
            ru: 'Уведомления и рестарт ноды уже включены',
            en: 'Notifications and node restart already enabled',
        }
    }
}