<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <button @click="selectedComponent = 'appQuotes'">Quote</button>
                <button @click="selectedComponent = 'appAuthor'">Author</button>
                <button @click="selectedComponent = 'appNew'">New</button>
                <hr/>
                <p>{{ selectedComponent }}</p>
                <keep-alive>
                    <component :is="selectedComponent">
                        <p>Default Content</p>
                    </component>
                </keep-alive>

                <!--<app-quotes>
                    <h2 slot="title">{{ quoteTitle }}</h2>
                    <p>A wonderful Quote</p>
                </app-quotes>-->
            </div>
        </div>
    </div>
</template>

<script>
    import Quote from './components/Quote.vue'
    import Author from './components/Author.vue'
    import New from './components/New.vue'

    export default {
        data: function () {
            return {
                quoteTitle: 'The Quote',
                selectedComponent: 'appQuotes',
            }
        },
        components: {
            appQuotes: Quote,
            appAuthor: Author,
            appNew: New,
        },
    }
</script>

<style>
</style>
