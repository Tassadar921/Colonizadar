import Stripe from 'stripe';
import SubscriptionProductTranslation from '#models/subscription_product_translation';
import env from '#start/env';
import Subscription from '#models/subscription';
import SubscriptionStatusEnum from '#types/enum/subscription_status_enum';
import StripeProductIntervalEnum from '#types/enum/stripe_product_interval_enum';
import { inject } from '@adonisjs/core';
import User from '#models/user';
import ExtendedStripeProduct from '#types/extended_stripe_product';

@inject()
export default class StripeService {
    public async createCheckoutSession(
        user: User,
        stripePriceId: string,
        subscriptionProductTranslation: SubscriptionProductTranslation,
        frontUri: string,
        previouslySubscribed: boolean
    ): Promise<Stripe.Checkout.Session | void> {
        if (Math.round(subscriptionProductTranslation.product.price) === 0 ? !previouslySubscribed : false) {
            return;
        }

        const stripe: Stripe = new Stripe(env.get('STRIPE_SECRET_KEY'));

        const subscription: Subscription = await Subscription.create({
            subscriptionProductId: subscriptionProductTranslation.product.id,
            userId: user.id,
            status: SubscriptionStatusEnum.PENDING,
        });

        const sessionData = await stripe.checkout.sessions.create({
            line_items: [
                {
                    quantity: 1,
                    price: stripePriceId,
                },
            ],
            customer_email: user.email,
            mode: subscriptionProductTranslation.product.mode,
            success_url: `${frontUri}/subscribe/success`,
            cancel_url: `${frontUri}/subscribe/cancel`,
        });

        subscription.stripeCheckoutSessionId = sessionData.id;
        await subscription.save();

        return sessionData;
    }

    public async activatePaidCheckoutSession(subscription: Subscription): Promise<boolean> {
        const stripe: Stripe = new Stripe(env.get('STRIPE_SECRET_KEY'));
        const session = await stripe.checkout.sessions.retrieve(subscription.stripeCheckoutSessionId);
        if (session.payment_status === 'paid') {
            if (session.subscription && typeof session.subscription === 'string') {
                subscription.stripeSubscriptionId = session.subscription;
            }
            subscription.status = SubscriptionStatusEnum.ACTIVE;
            await subscription.save();
            return true;
        }
        return false;
    }

    public async cancelSubscription(subscription: Subscription): Promise<boolean> {
        try {
            if (subscription.stripeSubscriptionId) {
                const stripe: Stripe = new Stripe(env.get('STRIPE_SECRET_KEY'));
                await stripe.subscriptions.cancel(subscription.stripeSubscriptionId, {
                    invoice_now: true,
                });
            }
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }

    public getDuration(interval: string): number {
        switch (interval) {
            case StripeProductIntervalEnum.DAY:
                return 1;
            case StripeProductIntervalEnum.WEEK:
                return 7;
            case StripeProductIntervalEnum.MONTH:
                return 30;
            case StripeProductIntervalEnum.YEAR:
                return 365;
            default:
                return 1;
        }
    }

    // Sync command method
    public async getProducts(): Promise<ExtendedStripeProduct[]> {
        const stripe: Stripe = new Stripe(env.get('STRIPE_SECRET_KEY'));
        const products: Stripe.Product[] = (await stripe.products.list()).data;
        return await Promise.all(
            products.map(async (product: Stripe.Product): Promise<ExtendedStripeProduct> => {
                const prices: Stripe.Price[] = (await stripe.prices.list({ product: product.id })).data;
                return { ...product, prices: prices };
            })
        );
    }
}
