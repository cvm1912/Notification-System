import PushNotifications from '@pusher/push-notifications-server'

const beamsClient = new PushNotifications({
   instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
   secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
})

export default beamsClient;